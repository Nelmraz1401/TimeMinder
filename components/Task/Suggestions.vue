<script setup >
  import axios from "axios"
  import moment from "moment"
  import { onMounted } from "vue"
  import APIs from "@/services/APIs.js" 
  import { useTasksStore } from '@/stores/tasks'
  import { useToastStore } from '@/stores/toast'
  const toastStore = useToastStore()
  const taskStore = useTasksStore()
  const list = computed(() => taskStore.listOfSuggestions)
  const suggestedForDate = computed(() => taskStore.suggestedForDate)
  const canShow = ref(false)
  const localStorageName = 'APP_TODO_CLOSE_SUGGESTION'

  /**
   * Add task for today
   * @param {Object} task 
   */
  async function addTaskForToday(task){
    delete task._id
    delete task.repeat_until
    delete task.repeat_on_days

    let settingTime = moment(task.deadline_on).format('HH:mm:ss')
    task['deadline_on'] = moment(suggestedForDate).format('YYYY-MM-DD') + 'T' + settingTime
    await taskStore.addTask(task)
    toastStore.setMessage('Task created')
  }

  function closeSuggestionForToday(){
    canShow.value = false
    localStorage.setItem(localStorageName, moment().format('YYYY-MM-DD'))
  }
  
  onMounted(() => {
    if( localStorage.getItem(localStorageName) != moment().format('YYYY-MM-DD') ){
        canShow.value = true
    }
  })
</script>

<template>
  <div v-if="canShow && list.length > 0" class=" p-0 py-2" >
    <div class="space-y-4" >
      <div class="flex justify-between" >
        <div>
          <p class="font-semibold text-xl">Suggested Task</p>
          <div class="text-xs text-gray-500" >This is based on you previous tasks</div>
        </div>
        <div @click="closeSuggestionForToday()" role="button" class="text-gray-500 text-xs" >Close for today</div>
      </div>
      <div v-for="(item, itemIndex) in list" :key="item._id" class="py-2 px-3 bg-gray-200 rounded flex items-center justify-between" >
        <div>
          {{ item.title }}
        </div>
        <button @click="addTaskForToday(item); list.splice(itemIndex, 1)" class="border bg-blue-50 px-2 py-1 rounded-md text-sm text-blue-500" >Create</button>
      </div>
    </div>
  </div>
</template>