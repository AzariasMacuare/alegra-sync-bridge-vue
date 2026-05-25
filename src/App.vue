<script setup lang="ts">
import { ref } from 'vue';
import ResultTable, { type SaleData } from './components/ResultTable.vue';
import AnimatedList from './components/ui/animated-list/AnimatedList.vue';
import Notification from './components/ui/animated-list/Notification.vue';
import FluidCursor from './components/ui/fluid-cursor/FluidCursor.vue';
import Uploader from './components/Uploader.vue';
import { openNewSocket, preFlightRegisterTransactionId, uploadInvoice } from './services/api';
import { useNotificationStore } from './stores/useNotificationStore';

const uploaded = ref(false);
const finished = ref(false);
const invoice = ref<SaleData>()
const store = useNotificationStore();

let socket: WebSocket;

export interface UploadedPayload {
  file: File
  description: string
}

const initSocket = (transactionId: string) => {
  if(socket) socket.close()
  socket = openNewSocket()  

  socket.onopen = () => {
    const payload = JSON.stringify({action: 'register', transactionId})
    socket.send(payload)
  }

  socket.onmessage = (event => {
    const {step, aditional: saleSaved} = JSON.parse(event.data)
    store.addNotification(step);
    
    if (step == 6) {
      setTimeout(async () => {
        invoice.value = saleSaved;
        finished.value = true;
        socket.close()
      }, 1000); 
    }
  });
};

const onUploaded = async (payload: UploadedPayload) => {
  store.activeNotifications = []
  finished.value = false;
  invoice.value = undefined;

  uploaded.value = true;
  store.addNotification(0);

  const transactionId = await preFlightRegisterTransactionId()
  initSocket(transactionId);
  await uploadInvoice(transactionId, payload.file, payload.description)
};
</script>

<template>
  <Uploader @on-uploaded="onUploaded" v-if="!uploaded"/>
  
  <div 
    v-if="uploaded" 
    class="fixed inset-0 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 overflow-hidden transition-all duration-1200 cubic-layout"
    :class="finished ? 'gap-6 md:gap-16' : 'gap-0'"
  >
    <div class="w-full max-w-md flex flex-col justify-center h-full transition-all duration-1200 cubic-layout">
      <ClientOnly>
        <AnimatedList :item-count="store.activeNotifications.length">
          <template #default>
            <Notification
              v-for="(item, idx) in store.activeNotifications"
              :key="item.id || idx"
              :name="item.name"
              :description="item.description"
              :icon="item.icon"
              :color="item.color"
              :time="item.time"
            />
          </template>
        </AnimatedList>
      </ClientOnly>
    </div>

    <div 
      class="overflow-hidden transition-all duration-1200 cubic-layout flex flex-col justify-center h-full"
      :class="finished && invoice ? 'w-full max-w-xl opacity-100' : 'w-0 max-w-0 opacity-0 pointer-events-none'"
    >
      <div class="w-[90vw] max-w-xl mx-auto p-2 transition-opacity duration-500" :class="finished ? 'opacity-100 delay-300' : 'opacity-0'">
        <ResultTable v-if="invoice" :data="invoice" />
      </div>
    </div>
  </div>

  <div class="fixed bottom-6 left-6 z-50 flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md shadow-lg text-[10px] font-medium tracking-wider uppercase text-gray-400 select-none">
    <a 
      href="https://github.com/AzariasMacuare/alegra-sync-bridge-vue" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="transition-colors hover:text-white flex items-center gap-1.5"
    >
      <span>💻</span> GitHub Front
    </a>
    <span class="text-white/10">|</span>
    <a 
      href="https://github.com/AzariasMacuare/alegra-sync-bridge-aws" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="transition-colors hover:text-white flex items-center gap-1.5"
    >
      <span>⚙️</span> GitHub Back
    </a>
    <span class="text-white/10">|</span>
    <a 
      href="https://www.linkedin.com/in/yosmaq/" 
      target="_blank" 
      rel="noopener noreferrer" 
      class="transition-colors hover:text-blue-400 flex items-center gap-1.5"
    >
      <span>💼</span> Creator LinkedIn
    </a>
  </div>

  <div class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md shadow-lg select-none">
    <span class="flex size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
    <p class="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
      App desarrollada para <span class="text-white font-bold">Alegra</span>
    </p>
  </div>

  <div class="fixed inset-0 pointer-events-none z-[9999]">
    <FluidCursor />
  </div>
</template>

<style scoped>
.cubic-layout {
  transition: all 1.2s cubic-bezier(0.25, 1, 0.5, 1) !important;
}

div:has(.is-active) {
  z-index: 9995 !important;
}
</style>