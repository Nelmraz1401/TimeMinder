<script setup >
  import axios from "axios"
  import APIs from "@/services/APIs.js"
  import { useToastStore } from '@/stores/toast'
  import { useLevelingStore } from '@/stores/leveling'

  useHead({
    title: "Dashboard - TimeMinder"
  })

  const levelingStore = useLevelingStore()
  const level = computed(() => levelingStore.level)
  const toastStore = useToastStore()

  const config = useRuntimeConfig()

  function logout(){
    const cookieToken = useCookie( config.public.COOKIE_NAME )
          cookieToken.value = null
    navigateTo('/signin')
  }

  const userInformation = useProfile()
  function getInformation(){
    axios.get(APIs.AUTH).then(res => {
      userInformation.value = res.data
      levelingStore.setLevel(res.data.level)

      if( userInformation.value.just_checked_in ){
        toastStore.setMessage('Daily Checked In +3 experience', 2)
      }
    })
  }

  onMounted(() => {
    getInformation()
  })
</script>


<template>
  <!-- <nav class="bg-white grid grid-cols-3 fixed top-0 left-0 w-full z-50 h-20" > -->
    <!-- <div class="flex col-span-2 space-x-2 bg-gray-100 px-4" >
      <div class="flex space-x-2 items-center text-primary-700 font-semibold" >
        <img src="/timeminder.png" class="w-12" />
      </div>
    </div>
    <div class="flex justify-between p-[1.8em] items-center space-x-6" > -->
      <!-- <Icon
            name="lucide:calendar"
            class="text-3xl transition-all cursor-pointer text-black" 
          />
      <div class="flex jutify-end gap-3">
        <NuxtLink to="/profile" v-if="userInformation.name" >
        <div class="flex space-x-2" >
          <div class="w-9 h-9 rounded-lg bg-primary-700 text-white flex items-center justify-center font-bold text2-white" >
            {{ level }}
          </div>
          <div class="text-left" >
            <div>{{ userInformation.name }}</div>
            <div class="text-xs text-gray-400" >{{ userInformation.email }}</div>
          </div>
        </div>
      </NuxtLink>
      <Icon
         @click="logout()"
            name="mingcute:exit-line"
            class="text-3xl transition-all cursor-pointer text-black" 
          />

      </div>     -->
     
      <!-- <button  >
        Logout
      </button> -->
    <!-- </div> -->
  <!-- </nav> -->
  <main class="md:overflow-hidden h-[100vh] w-[100vw]" >
    <slot />

    <Toast />
  </main>
</template>