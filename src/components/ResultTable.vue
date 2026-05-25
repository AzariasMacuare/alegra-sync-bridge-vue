<script lang="ts" setup>
import { formatCurrency } from "@/lib/formatCurrency";
import { Motion } from "motion-v";

export interface SaleData {
  country: string;
  price: number;
  currency: string;
  location: string;
  category: string;
  billId: string;
}

defineProps<{
  data: SaleData;
}>();
</script>

<template>
  <Motion
    :initial="{ opacity: 0, scale: 0.9, y: 30 }"
    :animate="{ opacity: 1, scale: 1, y: 0 }"
    :transition="{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }"
    class="relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden"
  >
    <div class="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
    <div class="absolute -top-20 left-1/2 -translate-x-1/2 size-40 bg-emerald-500/10 blur-3xl rounded-full"></div>

    <div class="mb-8 text-center relative z-10">
      <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      </div>
      <h3 class="text-2xl font-bold text-white tracking-tight">Sincronización Exitosa</h3>
      <p class="text-xs text-neutral-400 mt-1">Datos estructurados validados por IA y guardados en ERP. También el monto total ha sido convertido a moneda estándar (USD).</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 relative z-10">
      
      <div class="col-span-1 sm:col-span-2 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-1">
        <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Bill ID / Transaction UUID</span>
        <span class="font-mono text-sm text-emerald-400 select-all truncate">{{ data.billId }}</span>
      </div>

      <div class="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-1">
        <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Establecimiento</span>
        <span class="text-base font-semibold text-white">{{ data.location }}</span>
      </div>

      <div class="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-1">
        <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Categoría Contable</span>
        <span class="text-base font-semibold text-neutral-200 flex items-center gap-2">
          <span class="size-2 rounded-full bg-blue-500"></span>{{ data.category }}
        </span>
      </div>

      <div class="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-1">
        <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">País Detectado</span>
        <span class="text-base font-semibold text-neutral-200">{{ data.country }}</span>
      </div>

      <div class="rounded-xl bg-white/10 border border-white/10 p-4 flex flex-col gap-1 shadow-inner">
        <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Monto Procesado</span>
        <span class="text-xl font-black text-white tracking-tight">
          {{ formatCurrency(data.price, data.currency) }}
        </span>
      </div>

    </div>
  </Motion>
</template>