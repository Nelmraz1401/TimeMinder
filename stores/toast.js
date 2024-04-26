
export const useToastStore = defineStore('toasts', () => {
  const message = ref(null)
  const messageType = ref(1)
  let timeOut = null

  function setMessage(msg, type = 1){
    message.value = msg
    messageType.value = type

    timeOut = setTimeout(() => {
      dismiss()
    }, 5000)
  }

  function dismiss(){
    message.value = null
  }

  return {
    message, messageType,

    setMessage, dismiss
  }
})