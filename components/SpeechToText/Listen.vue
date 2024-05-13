<script setup >
  const speechToText = useSpeechToText()
  const emits = defineEmits(['speech'])

  const canUse = ref(false)
  const isListening = ref(false)
  let recognition = null
  const speech = ref('Listening...')
  let timeOut = null
  const showHelp = ref(false)

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
        speechToText.value.lastTime = new Date().getTime()
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
        <div>

          <div v-show="!showHelp" >
            <div class="flex space-x-2" >
              <div class="min-w-[24px] flex justify-center" >
              <Icon :name=" isListening ? 'material-symbols-light:mic-outline' : 'material-symbols-light:mic-off-outline' " class="w-6 h-6 mx-auto text-green-500" />
            </div>
            <div v-if="speech" >
              {{ speech }}
            </div>
            <div @click="showHelp = !showHelp" class="cursor-pointer" > 
              <Icon class="text-gray-500 w-6 h-6" name="material-symbols-light:help-outline-rounded" />
            </div>
            </div>
          </div>

          <div v-show="showHelp" > 
            <div @click="showHelp = false" class="cursor-pointer" >
              <div class="text-center p-4" >Command list</div>

              <div class="text-xs text-gray-500" >Say</div>
              <div>
                <span class="text-blue-500 uppercase font-semibold" >Create task</span> to open the task editor
              </div>
              <div>
                <span class="text-blue-500 uppercase font-semibold" >Cancel create</span> to close the task editor
              </div>
              <div>
                <span class="text-blue-500 uppercase font-semibold" >Next</span> to jump to next input
              </div>
              <div>
                <span class="text-blue-500 uppercase font-semibold" >Back</span> to jump to previous input
              </div>
              <div class="cursor-pointer text-center mt-2 text-sm text-gray-400" >Click to close</div>
            </div>
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