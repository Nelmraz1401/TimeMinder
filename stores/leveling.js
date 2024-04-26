
export const useLevelingStore = defineStore('leveling', () => {
  const show = ref(false)
  const level = ref(0)
  
  /**
   * Set the level of the authenticated user
   * 
   * @param {Number} l 
   */
  function setLevel(l){
    level.value = l
  }

  function levelUp(){

    setTimeout(() => {
      show.value = true
    }, 500)
  }

  function close(){
    show.value = false
  }

  return {
    show, level,

    setLevel, levelUp, close
  }
})