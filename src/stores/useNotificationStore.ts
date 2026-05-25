import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notifications', () => {
  const activeNotifications = ref<Array<any>>([])

  const stepsTemplate = [
    { name: "Cliente: Archivo Seleccionado", icon: "📄", color: "#297d40", description: "Archivo recibido está siendo cargado a la Nube..." },
    { name: "AWS S3: Carga Segura", icon: "📤", color: "#FFB800", description: "Se ha cargado al Bucket de S3 un manifiesto. Una copia fiel de los datos ingresados, para auditoría y log,  antes de ser procesados" },
    { name: "AWS SQS: Evento Detectado", icon: "📨", color: "#FF3D71", description: "La cola de Amazón ha detectado que se ha cargado un nuevo manifiesto. Activará el Worker para procesarlo." },
    { name: "AWS Lambda: Worker de Manifiesto", icon: "⚡", color: "#1E86FF", description: "La Lambda/Worker está descargandose el Manifiesto para iniciar el proceso de extracción de datos" },
    { name: "AI Agent: Processing", icon: "🤖", color: "#45B26B", description: "Se está utilizando IA para procesar toda la información. La IA extraerá sólo la información útil, la relevante para la venta en formato estándar de Negocio." },
    { name: "API Converter: Exchange", icon: "🔄", color: "#45B26B", description: "Se está convirtiendo la moneda y el monto de la transacción a Moneda Universal. Se está usando tasa de cambio actualizada a hoy." },
    { name: "Result: Final Sync", icon: "✅", color: "#45B26B", description: "Factura sincronizada exitosamente." }
  ]

  const addNotification = (index: number) => {
    const step = stepsTemplate[index];
    if (!step) return;

    const alreadyShown = activeNotifications.value.some(
      (n) => n.name === step.name,
    );
    if (alreadyShown) return;

    activeNotifications.value.push({
      ...step,
      id: Date.now(),
      time: String(Date.now()),
    })
  }

  return { activeNotifications, addNotification }
})