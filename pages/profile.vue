<script setup >
  import axios from "axios"
  import APIs from "@/services/APIs.js"
  import { useToastStore } from '@/stores/toast'

  definePageMeta({
    layout: 'app',
    middleware: 'auth',
  })

  useHead({
    title: "Profile - TimeMinder"
  })
  
  const toastStore = useToastStore()

  const basicForm = ref({
    name: "",
    email: "",
    birthdate: "",
    error: ""
  })
  
  const passwordForm = ref({
    current_password: "",
    new_password: "",
    retype_new_password: "",
    error: ""
  })

  function basicSubmit(){
    basicForm.value.error = ""

    axios.post( APIs.PROFILE_UPDATE + '/basic', basicForm.value).then(res => {
      toastStore.setMessage('Basic Information updated')
    }).catch(err => {
      basicForm.value.error = err.response.data.message
    })
  }

  function passwordSubmit(){
    passwordForm.value.error = ""

    axios.post( APIs.PROFILE_UPDATE + '/password', passwordForm.value).then(res => {
      passwordForm.value = {
        current_password: "",
        new_password: "",
        retype_new_password: "",
      }

      toastStore.setMessage('Password updated')
    }).catch(err => {
      passwordForm.value.error = err.response.data.message
    })
  }

  onMounted(() => {
    axios.get(APIs.AUTH).then(res => {
      basicForm.value.name = res.data.name
      basicForm.value.email = res.data.email
      basicForm.value.birthdate = res.data.birthdate
    });
  })

</script>

<template>
  <section class="container mb-24" >
    <div class="my-24 flex justify-between" >
      <div>
        <h2>My Account</h2>
      </div>
      <div>
        <NuxtLink to="/dashboard" class="btn-outline" >Back to Home</NuxtLink>
      </div>
    </div>

    <section class="grid grid-cols-2 gap-3" >
      <div>
        <h3>Basic Information</h3>
        <p>Update your basic information (For your eyes only).</p>
      </div>
      <div>
        <form @submit.prevent="basicSubmit" class="space-y-4" >
          <div>
            <label>Name</label>
            <input class="form-input" type="text" v-model="basicForm.name" required >
          </div>
          <div>
            <label>Email address</label>
            <input class="form-input" type="email" v-model="basicForm.email" required >
          </div>
          <div>
            <label>Birthdate</label>
            <input class="form-input" type="date" v-model="basicForm.birthdate" required >
          </div>
          <div v-show="basicForm.error" class="card-error !text-left" >
            {{ basicForm.error }}
          </div>
          <div>
            <button>Update Information</button>
          </div>
        </form>
      </div>
    </section>

    <hr class="my-24" >

    <section class="grid grid-cols-2 gap-3 mt-12" >
      <div>
        <h3>Password</h3>
        <p>It's best to update your password every month</p>
      </div>
      <div>
        <form @submit.prevent="passwordSubmit" class="space-y-4" >
          <div>
            <label>Current Password</label>
            <input class="form-input" type="password" v-model="passwordForm.current_password" required >
          </div>
          <div>
            <label>New Password</label>
            <input class="form-input" type="password" v-model="passwordForm.new_password" required >
          </div>
          <div>
            <label>Retype New Password</label>
            <input class="form-input" type="password" v-model="passwordForm.retype_new_password" required >
          </div>
          <div v-show="passwordForm.error" class="card-error !text-left" >
            {{ passwordForm.error }}
          </div>
          <div>
            <button>Update Password</button>
          </div>
        </form>
      </div>
    </section>

  </section>
</template>
