<script setup >
  const speechToText = useSpeechToText()
  const emits = defineEmits(['speech'])

  const canUse = ref(false)
  const isListening = ref(false)
  let recognition = null
  const speech = ref('Listening...')
  let timeOut = null

  let looseCount = 0
  function startRecognition(){
    console.log(`[SR STARTING]`)
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const results = e.results;
      const lastResult = results[results.length - 1];
      let lastTranscript = lastResult[lastResult.length - 1].transcript;
          lastTranscript = lastTranscript.trim().replace(speechToText.value.last.toLowerCase(), '')

      // if( !lastTranscript || lastResult.isFinal ) return false;
      console.log(`Receive: ${ lastTranscript }`)

      if( looseCount > 2 ){
        startRecognition()
        looseCount = 0
      }
      if( lastTranscript == '' ){
        looseCount++;
        console.log(`Loose count: ${ looseCount }`)
      }

      clearTimeout(timeOut)
      speech.value = lastTranscript

      timeOut = setTimeout(() => {
        speechToText.value.speech = lastTranscript
        emits('speech', lastTranscript)
        speech.value = 'Listening...'
      }, 1000)
    };

    recognition.end = (e) => {
      console.log(`[RECOG] Restarting Task`)
      recognition.start()
    }

    isListening.value = true
    recognition.start();
  }

  let lastSpeech = null;
  watch(() => speechToText.value.last, () => {
    if( lastSpeech != speechToText.value.last ){
      startRecognition()
      lastSpeech = speechToText.value.last
    }
  })

  onMounted(() => {
    canUse.value = ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

    if( canUse.value ){
      startRecognition()
    }
  })

</script>

<template>
  <div class="bottom-10 fixed left-2/4 -translate-x-2/4 bg-white p-2 shadow" >

    <template v-if="canUse" >
      <div>
        <div class="flex space-x-2" >
          <div class="min-w-[24px] flex justify-center" >
            <Icon :name=" isListening ? 'material-symbols-light:mic-outline' : 'material-symbols-light:mic-off-outline' " class="w-6 h-6 mx-auto text-green-500" />
          </div>
          <div v-if="speech" >
            {{ speech }}
          </div>
        </div>
      </div>
    </template>
    <template v-else >
      <div>
        Speech to text is not available. Use Chrome or Safari for best experience
      </div>
    </template>

  </div>
</template>