<script setup >
  import axios from "axios"
  import APIs from "@/services/APIs.js"
  import StateButton from "../components/StateButton.vue";
  import { useToastStore } from '@/stores/toast'
  const toastStore = useToastStore()

  definePageMeta({
    layout: 'guest',
    middleware: 'guest'
  })

  const config = useRuntimeConfig()
  const isLoading = ref(false)
  const input = ref({
    email: "",
    password: "",
  })
  const error = ref('')

  function submitForm(){
    error.value = ''
    isLoading.value = true

    axios({
      url: APIs.SIGNIN,
      method: "POST",
      data: input.value
    }).then(res => {
      const token = res.data.token
      toastStore.setMessage('Welcome Back!')

      const cookieToken = useCookie(config.public.COOKIE_NAME)
      cookieToken.value = token

      navigateTo('/')
    }).catch(err => {
      error.value = err.response.data.message
    }).finally(() => {
      isLoading.value = false
    })
  }

</script>

<template>
  <div class="h-[80vh] flex items-center justify-center" >
    <div class="container-small py-12" >
      <h2 class="text-center" >Welcome Back</h2>
      <form @submit.prevent="submitForm()" class="space-y-2" >
        <div>
          <label>Email address</label>
          <input type="text" class="form-input" v-model="input.email" >
        </div>
        <div>
          <label>Password</label>
          <input type="password" class="form-input" v-model="input.password" >
        </div>
        <div v-if="error" class="card-error" >
          {{ error }}
        </div>
        <div class="flex items-center justify-between" >
          <StateButton :isLoading="isLoading" >Login</StateButton>
          <div>Not a member? <NuxtLink class="font-semibold" to="/signup" >Sign up</NuxtLink></div>
        </div>
      </form>
    </div>
  </div>
</template>