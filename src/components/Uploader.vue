<script setup lang="ts">
import { ref } from 'vue';
import type { UploadedPayload } from '../App.vue';
import FileUpload from './ui/file-upload/FileUpload.vue';
import FileUploadGrid from './ui/file-upload/FileUploadGrid.vue';
import IInput from './ui/input/IInput.vue';

const description = ref('');
const selectedFile = ref<File | null>(null);

const emit = defineEmits<{
  (e: "onUploaded", payload: UploadedPayload): void;
}>();

const handleFileChange = (files: File[]) => files.length > 0 && (selectedFile.value = files[0]);

async function submitData() {
  if(!selectedFile.value) return
  emit("onUploaded", {file: selectedFile.value, description: description.value})
}

</script>

<template>
  <div class="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4">
    
    <div class="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl">
      
      <div class="space-y-1 text-center">
        <h2 class="text-xl font-semibold text-white tracking-tight">Ingestión de Datos</h2>
        <p class="text-xs text-gray-400">Define el manifiesto y carga el archivo</p>
      </div>

      <div class="space-y-2">
        <label for="description" class="text-[10px] uppercase tracking-widest text-gray-500 ml-1">
          Descripción de tu factura
        </label>
        <IInput
          id="description"
          v-model="description"
          placeholder="Ej: Factura a Cliente A..."
          container-class="w-full"
          class="bg-transparent text-white border-white/10 focus:border-blue-500/50"
        />
      </div>

      <div class="space-y-2">
        <label class="text-[10px] uppercase tracking-widest text-gray-500 ml-1">
          Upload your bill
        </label>
        <FileUpload 
          @on-change="handleFileChange"
          class="group relative rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-6 transition-all hover:border-blue-500/40 hover:bg-white/10"
        >
          <FileUploadGrid class="text-white" />
          
          <div class="mt-2 text-center text-xs text-gray-500 group-hover:text-black-300">
            Formatos aceptados: JSON, CSV, PDF
          </div>
        </FileUpload>
      </div>

      <button
        @click="submitData"
        class="w-full py-3 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
        :disabled="!selectedFile"
      >
        Iniciar Sincronización
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos extra para asegurar que los componentes internos respeten el Dark Mode */
:deep(.dark-bg-black) {
  background-color: transparent !important;
}

:deep(input) {
  color: white !important;
}

/* Animación sutil de entrada */
.rounded-3xl {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>