<script setup >
  import axios from "axios"
  import APIs from "@/services/APIs.js"
  import { useToastStore } from '@/stores/toast'
  const toastStore = useToastStore()

  definePageMeta({
    layout: 'guest',
    middleware: 'guest'
  })

  const input = ref({
    name: "",
    email: "",
    password: "",
  })
  const error = ref('')

  function submitForm(){
    error.value = ''

    axios({
      url: APIs.SIGNUP,
      method: "POST",
      data: input.value
    }).then(res => {
      toastStore.setMessage('Welcome to TimeMinder!')

      navigateTo('/signin')
    }).catch(err => {
      error.value = err.response.data.message
    })
  }

</script>

<template>
  <div class="container-small py-12" >
    <h2 class="text-center" >Register</h2>
    <form @submit.prevent="submitForm()" class="space-y-2" >
      <div>
        <label>Name</label>
        <input class="form-input" type="text" v-model="input.name" required >
      </div>
      <div>
        <label>Email address</label>
        <input class="form-input" type="email" v-model="input.email" required >
      </div>
      <div>
        <label>Password</label>
        <input class="form-input" type="password" v-model="input.password" required >
      </div>
      <div>
        <label>Re-type Password</label>
        <input class="form-input" type="password" v-model="input.retype_password" required >
      </div>
      <div v-show="error" class="card-error" >
        {{ error }}
      </div>
      <button>Submit</button>
    </form>
  </div>
</template>