<script setup >
  const speechToText = useSpeechToText()

  const speech = ref('')
  const emits = defineEmits(['speech'])

  function submit(){
    speechToText.value.speech = speech.value
    speechToText.value.last = speech.value
    speechToText.value.lastTime = new Date().getTime()
    emits('speech', speech.value)
    speech.value = ''

    console.log(`[SR TEST]: ${ speechToText.value.speech }`)
  }
</script>

<template>
  <form @submit.prevent="submit" class="fixed top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4 bg-white p-6 border space-y-3" >
    <textarea v-model="speech" ></textarea>
    <div>
      <button>Submit</button>
    </div>
  </form>  
</template>