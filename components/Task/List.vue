<script setup >
  import { computed, onMounted } from 'vue'
  import moment from "moment"
  import { useTasksStore } from '@/stores/tasks'
  const tasksStore = useTasksStore()
  const list = computed(() => tasksStore.list)
  const taskListFetching = computed(() => tasksStore.taskListFetching)

  function getPartitionHeader(date1, date2){
    if( !moment(date1).isSame(moment(date2), 'day') ){
      return `<div class="text-sm text-center uppercase font-semibold text-gray-400 mt-12 mb-2" >${ moment(date1).format('LL') }`
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
    fetchingFrom = moment(response.first.deadline_on)
    fetchingFromLoading.value = false
  }

  onMounted(() => {
    tasksStore.fetchTasks({
      from: fetchingFrom.format('YYYY-MM-DD'),
      action: 'RESET'
    });
  })
</script>

<template>
  <div class="h-[82vh] overflow-y-auto px-2 space-y-2" >

    <div class="flex items-center justify-center" >
      <div v-if="isStillAllowedToFetchOld" @click="fetchOld()" class="text-center px-4 py-2 border border-gray-300 rounded uppercase text-sm text-gray-700 cursor-pointer space-x-2 bg-gray-200 inline-block" >
        <div class="flex items-center justify-center" >
          <div v-show="fetchingFromLoading" class="w-3 h-3 rounded-full bg-blue-500 animate-ping mr-2" ></div>      
          <div>{{ fetchingFromLoading ? 'Loading' : 'Load' }} old tasks</div>
        </div>
      </div> 
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