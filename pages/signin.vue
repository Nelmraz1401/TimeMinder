<script setup >
  import axios from "axios"
  import APIs from "@/services/APIs.js"
import StateButton from "../components/StateButton.vue";

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
      <div>
        {{ error }}
      </div>
      <StateButton :isLoading="isLoading" >Login</StateButton>
    </form>
  </div>
</template>