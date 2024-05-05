import APIs from "@/services/APIs.js" 
import axios from "axios"
import { useToastStore } from '@/stores/toast'

export const useHabitsStore = defineStore('habits', () => {
  const list = ref([])

  function pushDummy(){
    list.value.push({
      _id: null,
      name: '',
      name_old: '',
      is_dummy: true,
      experience: 0
    })
  }

  /**
   * Fetch habits from the server
   */
  async function fetchHabits(){
    const response = await axios.get(`${ APIs.HABITS }`)

    response.data.forEach(item => {
      item.name_old = item.name
    })

    list.value = response.data

    pushDummy()
  }

  /**
   * Create a new habit
   */
  async function createHabit(){
    if( !list.value[ list.value.length - 1 ]['name'] ) return;

    const response = await axios.post(`${ APIs.HABITS }`, list.value[ list.value.length - 1 ])

    const toastStore = useToastStore()
    toastStore.setMessage('Habit Created')

    fetchHabits()
  }

  /**
   * Update a habit
   * 
   * @param {Number} index
   */
  async function updateHabit(index){
    const response = await axios.put(`${ APIs.HABITS }/${ list.value[index]['_id'] }`, list.value[index])
    
    fetchHabits()
  }

  /**
   * Delete Habit
   * 
   * @param {Number} index 
   */
  async function deleteHabit(index){
    const response = await axios.delete(`${ APIs.HABITS }/${ list.value[index]['_id'] }`)

    list.value.splice(index, 1)

    const toastStore = useToastStore()
    toastStore.setMessage('Habit Deleted')

    fetchHabits()
  }

  return {
    list,

    fetchHabits, createHabit, updateHabit, deleteHabit
  }
})