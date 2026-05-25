<script lang="ts" setup>
import { onClickOutside, useTimeAgo } from '@vueuse/core';
import { computed, ref } from 'vue';

const props = defineProps<{
  name: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}>();

const el = ref<HTMLElement | null>(null);
const isFront = ref(false);
const isHovered = ref(false);
const coords = ref({ x: 0, y: 0 });
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

const toggleFront = async () => {
  if (!isFront.value && el.value) {
    const rect = el.value.getBoundingClientRect();
    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2;

    coords.value = {
      x: windowCenterX - (rect.left + rect.width / 2),
      y: windowCenterY - (rect.top + rect.height / 2)
    };
    
    isFront.value = true;
  } else {
    isFront.value = false;
    coords.value = { x: 0, y: 0 };
  }
};

onClickOutside(el, () => {
  if (isFront.value) {
    isFront.value = false;
    coords.value = { x: 0, y: 0 };
  }
});

const handleMouseEnter = () => {
  if (!isFront.value) {
    hoverTimeout = setTimeout(() => {
      isHovered.value = true;
    }, 200);
  }
};

const handleMouseLeave = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  isHovered.value = false;
};

const dynamicStyle = computed(() => ({
  transform: isFront.value 
    ? `translate3d(${coords.value.x}px, ${coords.value.y}px, 0) scale(1.4)`
    : `translate3d(0, 0, 0) scale(1)`,
  zIndex: isFront.value ? 100 : 10,
  boxShadow: isFront.value ? `0 40px 80px rgba(0,0,0,0.65), 0 0 40px ${props.color}33` : '' 
}));
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div 
        v-if="isFront" 
        class="overlay-fixed"
        @click.stop="toggleFront"
      ></div>
    </Transition>
  </Teleport>

  <div
    ref="el"
    @click.stop="toggleFront"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :class="[
      'card-container',
      (isHovered || isFront) ? 'bg-white/20' : 'bg-white/10',
      isFront ? 'shadow-[0_0_40px_rgba(0,0,0,0.7)] is-active' : 'shadow-lg'
    ]"
    :style="[
      dynamicStyle, 
      { borderColor: isFront ? props.color : 'rgba(255, 255, 255, 0.1)' }
    ]"
  >
    <div class="border-filler" :style="{ color: props.color }"></div>

    <div class="absolute inset-x-0 top-0 h-px w-full" :style="`background: linear-gradient(90deg, transparent, ${color}, transparent)`"></div>

    <div class="flex flex-row items-start gap-3">
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-inner transition-transform duration-700"
        :style="`background-color: ${color}`"
        :class="isFront ? 'scale-110 rotate-3' : ''"
      >
        <span class="text-lg">{{ icon }}</span>
      </div>

      <div class="flex flex-col overflow-hidden w-full">
        <div class="flex flex-row items-center justify-between dark:text-white">
          <span class="text-sm font-bold sm:text-base">{{ name }}</span>
          <span class="text-[10px] text-gray-400 opacity-70">{{ useTimeAgo(time, {updateInterval: 10000}) }}</span>
        </div>
        
        <p :class="[
          'mt-1 text-sm font-normal text-gray-400 line-clamp-1 transition-all duration-500',
          (isFront || isHovered) ? 'opacity-0 max-h-0 mt-0' : 'opacity-100 max-h-10'
        ]">
          {{ description }}
        </p>

        <div 
          :class="[
            'grid transition-[grid-template-rows] duration-500 ease-in-out',
            (isHovered || isFront) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          ]"
        >
          <div class="overflow-hidden">
            <p class="mt-2 text-sm leading-relaxed text-gray-300">
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@property --fill-percent {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

.card-container {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 400px;
  cursor: pointer;
  border-radius: 1rem;
  border: 1.5px solid rgba(255, 255, 255, 0.1); 
  padding: 1rem;
  backdrop-filter: blur(20px);
  
  transition: 
    transform 0.8s cubic-bezier(0.25, 1, 0.5, 1),
    border-color 5s ease-in-out,
    background-color 0.5s ease,
    box-shadow 0.8s ease;

  will-change: transform, opacity, filter, border-color;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  transform-style: preserve-3d;
}

.border-filler {
  position: absolute;
  inset: -1.5px;
  border: 1.5px solid currentColor;
  border-radius: 1rem;
  pointer-events: none;
  mask: linear-gradient(to bottom, black var(--fill-percent), transparent var(--fill-percent));
  -webkit-mask: linear-gradient(to bottom, black var(--fill-percent), transparent var(--fill-percent));
  transition: --fill-percent 3s ease-in-out;
  --fill-percent: 0%;
  opacity: 0;
}

.is-active .border-filler {
  --fill-percent: 100%;
  opacity: 1;
}

.overlay-fixed {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px); 
  z-index: 9990;
}

.overlay-fade-enter-active {
  transition: all 0.5s ease-out;
}
.overlay-fade-leave-active {
  transition: all 0.4s ease-in;
}
.overlay-fade-enter-from, .overlay-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}
</style>