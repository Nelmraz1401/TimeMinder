<script setup >
  import { computed, onMounted } from 'vue'
  import moment from "moment"
  import { useTasksStore } from '@/stores/tasks'
  const tasksStore = useTasksStore()
  const list = computed(() => tasksStore.list)
  const taskListFetching = computed(() => tasksStore.taskListFetching)

  function getPartitionHeader(date1, date2){
    if( !moment(date1).isSame(moment(date2), 'day') ){
      return `<div class="text-sm text-start ml-5 uppercase font-medium text-gray-400 mt-12 mb-3" >${ moment(date1).format('LL') }`
    }else{
      return ''
    }
  }

  let fetchingFrom = moment()
  let fetchingFromLoading = ref(false)
  const isStillAllowedToFetchOld = ref(true)
  async function fetchOld(){
    fetchingFromLoading.value = true

    const response = await tasksStore.fetchTasks({
      before: fetchingFrom.format('YYYY-MM-DD'),
      action: 'UNSHIFT'
    })

    isStillAllowedToFetchOld.value = response.total > 0
    fetchingFromLoading.value = false
    fetchingFrom = moment(response.first.deadline_on)
  }

  onMounted(async () => {
    await tasksStore.fetchTasks({
      from: fetchingFrom.format('YYYY-MM-DD'),
      action: 'RESET'
    });

    if( list.length == 0 ){
      fetchOld()
    }

    const taskList = document.querySelector("#taskList");
          taskList.scrollTop += 10
    
    taskList.addEventListener("scroll", async function(){
      if( taskList.scrollTop == 0 && isStillAllowedToFetchOld.value == true ){
        await fetchOld()
        taskList.scrollTop += 10
      }
    })

  })
</script>

<template>
  <div id="taskList" class="h-[96vh] overflow-y-auto p-5 space-y-2" >
    <p class="text-xl font-medium ml-2">Task List</p>
    <div v-show="fetchingFromLoading" class="w-full p-4 text-gray-700 flex items-center justify-center space-x-2" >
      <div class="w-3 h-3 rounded-full bg-primary-700 animate-ping mr-2" ></div>      
      <div>Loading</div>
    </div>

    <div v-show="taskListFetching == false && list.length == 0" class="py-24 text-center space-y-2" >
      <div class="text-2xl text-gray-600" >Yey 🎉 No incoming or todays tasks</div>
    </div>

    <div v-show="taskListFetching" class="space-y-2" >
      <div v-for="i in 10" :key="`placeholder-${ i }`" class="animate-pulse h-28 w-full border bg-gray-200 rounded-md" ></div>
    </div>

    <div v-for="(item, itemIndex) in list" :key="item._id">
      <div v-html="getPartitionHeader(item.deadline_on, list[itemIndex - 1] ? list[itemIndex - 1].deadline_on  : null )" ></div>

      <div class="ml-2" >
        <TaskItem :data="item" :index="itemIndex" />
      </div>
    </div>

  </div>
</template>