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

  const userInformation = ref({
    just_checked_in: false
  })
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
  <nav class="p-4 bg-white border-b flex items-center justify-between fixed top-0 left-0 w-full z-50 h-20" >
    <div class="flex space-x-2" >
      <div class="flex space-x-2 items-center text-primary-700 font-semibold" >
        <img src="/timeminder.png" class="w-12" />
        <div>TimeMinder</div>
      </div>
    </div>
    <div class="flex items-center space-x-6" >
      <NuxtLink to="/profile" v-if="userInformation.name" >
        <div class="flex space-x-2" >
          <div class="text-right" >
            <div>{{ userInformation.name }}</div>
            <div class="text-xs text-gray-400" >{{ userInformation.email }}</div>
          </div>
          <div class="w-9 h-9 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text2-white" >
            {{ level }}
          </div>
        </div>
      </NuxtLink>
      <button @click="logout()" >
        Logout
      </button>
    </div>
  </nav>
  <main class="mt-20 p-5" >
    <slot />

    <Toast />
  </main>
</template>