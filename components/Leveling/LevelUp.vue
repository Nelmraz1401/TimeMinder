<script setup > 
  import ConfettiExplosion from "vue-confetti-explosion";
  import { useLevelingStore } from '@/stores/leveling'

  const levelingStore = useLevelingStore()
  const level = computed(() => levelingStore.level)
  const levelingShow = computed(() => levelingStore.show)
</script>

<template>
  <Transition name="slide-fade" >
    <div
      @click="levelingStore.close()"
      v-if="levelingShow"
      id="levelUpModal"
      class="flex items-center justify-center fixed top-0 left-0 h-screen w-screen z-[50] transition-all" 
    >
      
      <div class="fixed top-0 left-0 h-screen w-screen bg-white bg-opacity-80 z-[51]"></div>
      
      <div class="bg-white py-6 px-24 z-[52] text-center shadow rounded-md cursor-pointer" >
        <ConfettiExplosion />
        
        <h3 class="text-xl uppercase" >You Level Up</h3>
        <p class="mt-1 text-gray-400" >Congratulations!</p>
        
        <h1 class="text-5xl my-6 font-semibold text-yellow-500" >{{ level }}</h1>
        <img src="/trophy.png" class="relative w-24 h-24 mx-auto mb-4" />

        <div class="mt-1 text-sm text-gray-400" >Click to close</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>