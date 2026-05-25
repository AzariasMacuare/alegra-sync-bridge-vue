<script lang="ts" setup>
import { cn } from "@inspira-ui/plugins";
import { Motion } from "motion-v";
import { ref, useSlots, watch } from "vue";

const props = withDefaults(
  defineProps<{ class?: string; delay?: number; itemCount: number }>(),
  { delay: 1000, itemCount: 0 },
);

const slots = useSlots();
const displayedItems = ref<{ node: unknown; id: string }[]>([]);
let revealGeneration = 0;

function getSlotChildren(): unknown[] {
  const rendered = slots.default ? slots.default() : [];
  if (!rendered.length) return [];

  const first = rendered[0] as { children?: unknown[] };
  return Array.isArray(first.children) ? first.children : rendered;
}

watch(
  () => props.itemCount,
  async (targetLen, prevLen) => {
    if (targetLen === 0) {
      revealGeneration++;
      displayedItems.value = [];
      return;
    }

    if (targetLen < (prevLen ?? 0)) {
      revealGeneration++;
      displayedItems.value = [];
    }

    const gen = ++revealGeneration;

    while (displayedItems.value.length < targetLen) {
      if (gen !== revealGeneration) return;

      const children = getSlotChildren();
      const cursor = displayedItems.value.length;
      if (cursor >= children.length) break;

      displayedItems.value.push({
        node: children[cursor],
        id: `item-${cursor}-${Date.now()}`,
      });

      const remaining = targetLen - displayedItems.value.length;
      if (remaining > 0 && targetLen > 1) {
        await new Promise((resolve) => setTimeout(resolve, props.delay));
      }
    }
  },
  { flush: "post", immediate: true },
);
</script>

<template>
  <div :class="cn('flex flex-col items-center w-full', props.class)">
    <transition-group
      name="list"
      tag="div"
      class="flex flex-col-reverse items-center gap-3 w-full"
      move-class="move-active"
    >
      <Motion
        v-for="data in displayedItems"
        :key="data.id"
        as="div"
        class="w-full"
        :initial="{ scale: 0.8, opacity: 0, y: 20 }"
        :animate="{ scale: 1, opacity: 1, y: 0 }"
        :transition="{ type: 'spring', stiffness: 200, damping: 20 }"
      >
        <component :is="data.node" />
      </Motion>
    </transition-group>
  </div>
</template>

<style scoped>
.move-active {
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
