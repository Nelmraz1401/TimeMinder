<script setup >
  import { useToastStore } from '@/stores/toast'
  const toastStore = useToastStore()
  const message = computed(() => toastStore.message)
  const messageType = computed(() => toastStore.messageType)
</script>

<template>
  <div v-show="message" class="toast" @click="toastStore.dismiss()" >
    <Icon v-show="messageType === 1" name="material-symbols-light:check-circle-outline" class="text-2xl text-blue-600" />
    <Icon v-show="messageType === 2" name="ph:sparkle-thin" class="text-2xl text-blue-600" />
    <div>{{ message }}</div>
  </div>
</template>

<style scoped>
  .toast{
    @apply bg-white py-2 px-4 rounded-md border space-x-2 transition-all;
    display: flex; 
    align-items: center;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    z-index: 60;
  }
</style>