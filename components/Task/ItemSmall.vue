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
    class="flex justify-between border border-gray-300 rounded-lg p-5 bg-white" 
    :class="{
      'border-red-100': !props.data.finished_on && deadline_on_moment < today_moment
    }"
  >
    <div class="flex gap-[30px]">
      <div>
        <input @change="tasksStore.toggleTaskFinish(props.data._id)" :checked="data.finished_on" type="checkbox" class="form-checkbox h-5 w-5 text-blue-500 rounded-md">
      </div>
      <div class="flex space-x-2" >
        <div>
          <div :class="data.finished_on ? 'line-through text-gray-400': ''" class="text-lg font-medium mb-1 leading-5" >{{ data.title }}</div>
          <div :class="data.finished_on ? 'line-through text-gray-400': ''" class="text-sm text-gray-500" >{{ data.description }}</div>

          <div class="mt-2 flex text-xs space-x-2" >
            <div  :class="data.finished_on ? 'line-through text-gray-400': ''">Deadline: {{ moment(data.deadline_on).format('MM/DD/YYYY LT') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>