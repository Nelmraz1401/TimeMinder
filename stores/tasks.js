import axios from "axios"
import APIs from "@/services/APIs.js" 
import moment from "moment"
import { useLevelingStore } from '@/stores/leveling'

export const useTasksStore = defineStore('tasks', () => {
  const list = ref([])
  const taskListFetching = ref(true)
  const listInCalendar = ref([])
  const overview = ref({
    dues: 0,
    today: 0,
    incoming: 0,
  })
  const listInCalendarSorted = ref({})
  const numberOfDays = moment().daysInMonth()
  const listOfSuggestions = ref([])
  
  let activeMonth = moment()

  /**
   * Add task
   */
  async function addTask(task){
    await axios.post(APIs.TASKS, task)
    await fetchTasks({ from: moment().format('YYYY-MM-DD') })
    await fetchTasksForCalendar()
    await fetchOverview()
  }

  /**
   * Set new active month
   * 
   * @param {Object} newActiveMonth 
   */
  function setActiveMonth(newActiveMonth){
    activeMonth = newActiveMonth
  }

  /**
   * Toggle the task status
   * @param {String} _id - ID of the task
   */
  async function toggleTaskFinish(_id){
    for (let index = 0; index < list.value.length; index++) {
      const element = list.value[index];
      if( element._id == _id ){
        list.value[index]['finished_on'] = element['finished_on'] ? null : new Date()

        const response = await axios.put(`${ APIs.TASKS }/${ _id }`, {
          finished_on: element['finished_on']
        })

        // Check if level up
        if( response.data.leveling.is_level_up ){
          const levelingStore = useLevelingStore()
                levelingStore.setLevel(response.data.leveling.level)
                levelingStore.levelUp()
        }

        await fetchOverview()
        await fetchTasksForCalendar()
        break
      }
    }
  }

  /**
   * Get overview
   */
  async function fetchOverview(){
    axios.get(`${ APIs.TASKS }/overview?ct=${ moment().valueOf() }`).then(res => {
      overview.value = res.data
    })
  }

  /**
   * Remove a task from the list
   * @param {Number} index 
   */
  async function removeTask(index){
    list.value.splice(index, 1)
    await fetchOverview()
  }

  /**
   * Fetch task from the API
   * 
   * @param {Object} queries
   */
  async function fetchTasks(queries = {}){
    console.log(`[FETCHING TASKS]`)
    console.log(queries)

    taskListFetching.value = true
    let queriesString = new URLSearchParams(queries).toString()

    const res = await axios.get(`${ APIs.TASKS }?${ queriesString }`)

    if( queries.action ){
      switch(queries.action){
        case 'UNSHIFT':
          res.data.forEach(item => {
            list.value.unshift(item)
          })
          break;
        case 'PUSH':
          list.value.push(res.data)
          break;
        default:
          list.value = res.data
          break;
      }
    }else{
      list.value = res.data
    }

    taskListFetching.value = false
    return {
      total: res.data.length,
      first: res.data[res.data.length - 1]
    }
  }

  /**
   * Get the list of task that is placed
   * inside the calendar
   */
  async function fetchTasksForCalendar(){
    const from = activeMonth.startOf('month').format('YYYY-MM-DD')
    const to = activeMonth.endOf('month').format('YYYY-MM-DD')
    const res = await axios.get(`${ APIs.TASKS }?from=${ from }&to=${ to }`)

    listInCalendar.value = res.data

      for(let i = 1; i <= numberOfDays; i++){
        let deadlineString = `${ activeMonth.format('YYYY-MM-') }${ String(i).padStart(2, 0) }`
        listInCalendarSorted.value[deadlineString] = []
  
        res.data.forEach(item => {
          if( item.deadline_on.includes(deadlineString) ){
            listInCalendarSorted.value[deadlineString].push(item)
          }
        })
      }
  }

  /**
   * Fetch the suggestions
   * @param {String} date
   */
  const suggestedForDate = ref(null)
  async function fetchSuggestions(date){
    suggestedForDate.value = date
    axios.get(APIs.TASKS + '?unique=true&deadline_day=' + moment(date).weekday()).then(res => {
      listOfSuggestions.value = res.data
    })
  }

  return { 
    list, listInCalendarSorted, taskListFetching, overview,
    activeMonth, listOfSuggestions, suggestedForDate,

    fetchTasks, fetchTasksForCalendar, removeTask, toggleTaskFinish,
    fetchOverview, setActiveMonth, fetchSuggestions, addTask
  }
})