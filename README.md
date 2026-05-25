# Alegra Sync Bridge - Real-Time Dashboard 📊✈️

Un dashboard moderno e interactivo desarrollado con **Vue 3**, **TypeScript** y **Tailwind CSS v4**, diseñado para monitorear en tiempo real el flujo secuencial de ingesta y procesamiento de documentos fiscales (facturas).

El proyecto simula y visualiza el estado vivo de una arquitectura orientada a eventos (*Event-Driven Architecture*) que interactúa con múltiples microservicios y componentes de infraestructura en la nube (AWS + GenAI).

---

## ⚡ Características Principales

* **Real-Time Reactive Streaming:** Conexión persistente mediante WebSockets (`Socket.io-client`) acoplada al estado global de la aplicación.
* **Gestión de Estado Robusta:** Centralización del flujo y control de múltiples cargas asíncronas concurrentes a través de **Pinia**.
* **UI/UX de Alto Nivel:** Animaciones fluidas basadas en físicas (*Spring physics*) utilizando `motion-v`, `Inspira UI` y un cursor fluido interactivo.
* **Arquitectura Desacoplada:** Componentes visuales agnósticos que reaccionan pasivamente a los cambios del pipeline orquestado por el Backend (NestJS).

---

## 🏗️ El Pipeline de Ingesta (Flujo Secuencial)

El dashboard renderiza de manera dinámica el progreso del documento a través de las siguientes etapas clave:

1.  **Client: Select File** 📄 – Carga inicial del archivo y validación del lado del cliente.
2.  **S3: Secure Upload** 📤 – Almacenamiento seguro del objeto en Amazon S3 y generación del manifiesto.
3.  **SQS: Event Queue** 📨 – Encolamiento del evento para garantizar procesamiento asíncrono y tolerancia a fallos.
4.  **Lambda: Worker Pick** ⚡ – Activación del Worker serverless encargado de descomponer el manifiesto.
5.  **AI Agent: Processing** 🤖 – Extracción inteligente de metadatos útiles mediante modelos de Inteligencia Artificial (Gemini).
6.  **Result: Final Sync** ✅ – Sincronización final, escritura en base de datos y confirmación exitosa.

---

## 🛠️ Stack Tecnológico

* **Framework:** Vue 3 (Composition API / `<script setup>`)
* **Lenguaje:** TypeScript (Type-Safe Events & Stores)
* **Estilos:** Tailwind CSS v4.0 (Aprovechando `@theme inline` y el espacio de color moderno `OKLCH`)
* **Manejador de Estado:** Pinia
* **Animaciones:** Motion-V + Inspira UI Plugins
* **Comunicaciones:** Socket.io-client

---
