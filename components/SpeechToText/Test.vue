<script setup >
  import Artyom from "artyom.js"

  const speech = ref('')
  const emits = defineEmits(['speech'])

  onMounted(() => {
    const artyom = new Artyom();

    var UserDictation = artyom.newDictation({
      continuous: true,
      onResult:function(text){
          console.log(text);
      },
      onStart:function(){
          console.log("Dictation started by the user");
      },
      onEnd:function(){
          alert("Dictation stopped by the user");
      }
    });

    UserDictation.start();
  })

  function submit(){
    emits('speech', speech.value)
    speech.value
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