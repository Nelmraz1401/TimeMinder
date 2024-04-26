<script setup >
  import APIs from "@/services/APIs.js" 
  import { useTasksStore } from '@/stores/tasks'
  import moment from "moment"
  const tasksStore = useTasksStore()

  const props = defineProps(['data', 'index'])
  const emits = defineEmits(['editing', 'deleted'])
  const deadline_on_moment = moment(props.data.deadline_on).valueOf()
  const today_moment = moment().valueOf()

  function deleteItem(){
    fetch(`${ APIs.TASKS }/${ props.data._id }`, {
      method: 'DELETE'
    })

    tasksStore.removeTask(props.index)
  }

</script>

<template>
  <div
    class="flex justify-between border rounded p-4 bg-white" 
    :class="{
      'border-red-500': !props.data.finished_on && deadline_on_moment < today_moment
    }"
  >
    <div>
      <div @click="tasksStore.toggleTaskFinish(props.data._id)" >
        <Icon 
          name="material-symbols-light:check-circle-outline"
          class="text-4xl transition-all cursor-pointer -ml-1" 
          :class="{
            'text-gray-300': !data.finished_on,
            'text-blue-600': data.finished_on,
          }"
        />
      </div>
      <div class="flex space-x-2" >
        <div>
          <div class="font-semibold mb-1" >{{ data.title }}</div>
          <div class="text-gray-500" >{{ data.description }}</div>

          <div class="mt-2 flex text-xs space-x-2" >
            <div>Deadline {{ moment(data.deadline_on).format('LT') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>