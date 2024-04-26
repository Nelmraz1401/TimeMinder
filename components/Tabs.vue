<script setup >
  const props = defineProps({
    items: []
  })
  const activeIndex = ref(2)
</script>

<template>
  <section>
      <div class="flex space-x-2" >
        <div
          :class="[
            activeIndex == itemIndex ? 'bg-aquablue bg-opacity-50 text-blue-500 !border-blue-500' : '!text-gray-500'
          ]"
          class="p-2 pl-1 pr-8 text-gray-700 rounded-t-md cursor-pointer uppercase select-none transition-all font-semibold border-b-4 border-gray-100"
          v-for="(item, itemIndex) in props.items" :key="itemIndex" @click="activeIndex = itemIndex" 
        >
          {{ item }}
        </div>
      </div>
      <div class="p-2 bg-gray-100 mt-6" v-for="(item, itemIndex) in props.items" :key="itemIndex" v-show="activeIndex == itemIndex" >
        <slot :name="itemIndex" />
      </div>
    </section>
</template>