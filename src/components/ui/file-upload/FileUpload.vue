<script lang="ts" setup>
import { cn } from "@inspira-ui/plugins";
import ClientOnly from "@/components/ClientOnly.vue";
import { Motion } from "motion-v";
import type { HTMLAttributes } from "vue";
import { ref } from "vue";

interface FileUploadProps {
  class?: HTMLAttributes["class"];
}

defineProps<FileUploadProps>();

const emit = defineEmits<{
  (e: "onChange", files: File[]): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const isActive = ref<boolean>(false);

function handleFileChange(newFiles: File[]) {
  files.value = [...files.value, ...newFiles];
  emit("onChange", files.value);
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  handleFileChange(Array.from(input.files));
}

function handleClick() {
  fileInputRef.value?.click();
}

function handleEnter() {
  isActive.value = true;
}
function handleLeave() {
  isActive.value = false;
}
function handleDrop(e: DragEvent) {
  isActive.value = false;
  const droppedFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
  if (droppedFiles.length) handleFileChange(droppedFiles);
}
</script>
<template>
  <ClientOnly>
    <div
      :class="cn(`w-full`, $props.class)"
      @dragover.prevent="handleEnter"
      @dragleave="handleLeave"
      @drop.prevent="handleDrop"
      @mouseover="handleEnter"
      @mouseleave="handleLeave"
    >
      <div
        class="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
        @click="handleClick"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          @change="onFileChange"
        />

        <div class="pointer-events-none absolute inset-0 z-0 opacity-40">
          <slot />
        </div>

        <div class="relative z-10 flex flex-col items-center justify-center">
          <p class="font-sans text-base font-bold text-neutral-300">
            Upload File
          </p>

          <div class="relative mx-auto mt-10 w-full max-w-xl space-y-4">
            <Motion
              v-for="(file, idx) in files"
              :key="`file-${idx}`"
              :initial="{ opacity: 0, scaleX: 0 }"
              :animate="{ opacity: 1, scaleX: 1 }"
              class="relative z-40 mx-auto flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white/10 p-4 backdrop-blur-md shadow-sm md:h-24"
            >
              <div class="flex w-full items-center justify-between gap-4">
                <p class="max-w-xs truncate text-base text-white">{{ file.name }}</p>
                <p class="rounded-lg bg-white/20 px-2 py-1 text-sm text-white">
                  {{ (file.size / (1024 * 1024)).toFixed(2) }} MB
                </p>
              </div>

              <div
                class="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400"
              >
              <Motion
                as="p"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                class="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 border border-white/10"
              >
                {{ file.type || "unknown" }}
              </Motion>
                
                <Motion
                  as="p"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  class="text-xs text-neutral-400"
                >
                  modified {{ new Date(file.lastModified).toLocaleDateString() }}
                </Motion>
              </div>
            </Motion>

            <template v-if="!files.length">
              <Motion
                as="div"
                class="relative z-40 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-xl bg-white/10 shadow-2xl backdrop-blur-md border border-white/20 group-hover/file:bg-white/20"
                :animate="isActive ? { x: 20, y: -20, opacity: 0.9 } : { x: 0, y: 0, opacity: 1 }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
              </Motion>

              <div
                :class="
                  cn(
                    `absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-xl border border-dashed border-blue-400 bg-blue-500/10 transition-opacity`,
                    isActive ? 'opacity-100' : 'opacity-0',
                  )
                "
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.group-hover\/file\:shadow-2xl:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
</style>
