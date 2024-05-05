<script setup >
  const props = defineProps({
    items: {
      type: Array
    }
  })

  const config = useRuntimeConfig()

  function logout(){
    const cookieToken = useCookie( config.public.COOKIE_NAME )
          cookieToken.value = null
    navigateTo('/signin')
  }

  const activeIndex = ref(0)
  const emit = defineEmits(['selected'])
  
  function updateActiveIndex(index){
    activeIndex.value = index
    emit('selected', index);
  }
</script>

<template>
  <section class="flex flex-col-reverse md:flex-row  h-[100%] w-[100%] pl-0 md:pl-2 items-center overflow-x-hidden">
      <div class="fixed w-full -ml-1 md:ml-0 md:w-max bottom-0 z-[999] flex justify-center md:justify-between py-2 md:py-5 items-center gap-3 space-x-2 flex-col bg-[#4264D0] px-2 md:rounded-[16px] h-max md:h-[100%] md:relative" >
        <div class="hidden md:inline-block w-100 flex flex-col  justiy-center  text-center ">
          <img src="/timeminder.png" class="w-12 mb-2" />
          <p class="mx-auto  leading-4  text-white font-bold text-sm">TIME <br> MINDER</p>
        </div>
        <div class="gap-5 space-x-2 flex flex-row md:flex-col">
          <div
            style="margin: 0px 5px;"
            :class="[
              activeIndex == itemIndex ? 'bg-blue-400 ': ''
            ]"
            class="p-2 flex flex-col justify-center items-center text-gray-700 rounded-lg cursor-pointer uppercase select-none transition-all font-semibold  border-gray-100"
            v-for="(item, itemIndex) in props.items" :key="itemIndex" @click="updateActiveIndex(itemIndex)" 
          >
            <Icon
                :name="item.icon"
                class="text-3xl transition-all cursor-pointer text-white" 
              />
            <p class="text-[0.6em] text-white font-normal">{{ item.name }}</p>
            
          </div>
        </div>
        <div class="hidden md:inline-block" @click="logout()">
          <Icon
              name="mingcute:exit-line"
              class="text-[2.5em] transition-all cursor-pointer text-white" 
            />
        </div>
      </div>
      <div class=" p-0 md:p-2 bg-gray-100 w-[100%] h-[100%]" v-for="(item, itemIndex) in props.items" :key="itemIndex" v-show="activeIndex == itemIndex" >
        <slot :name="itemIndex" />
      </div>
    </section>
</template>