<script setup >
  import APIs from "@/services/APIs.js" 
  import { useTasksStore } from '@/stores/tasks'
  import moment from "moment"
  const tasksStore = useTasksStore()
  const editingTaskState = useEditingTask()

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
      <div class="flex space-x-2" >
        <div @click="tasksStore.toggleTaskFinish(props.data._id)" >
          <Icon 
            name="material-symbols-light:check-circle-outline"
            class="text-4xl transition-all cursor-pointer" 
            :class="{
              'text-gray-300': !data.finished_on,
              'text-blue-600': data.finished_on,
            }"
          />
        </div>
        <div>
          <div class="font-semibold mb-1" >{{ data.title }}</div>
          <div class="text-gray-500" >{{ data.description }}</div>

          <div class="mt-2 flex text-xs space-x-2" >
            <div v-if="data.habit" class="font-semibold" >{{ data.habit.name }}</div>
            <div v-if="data.habit" >·</div>
            <div>Deadline {{ moment(data.deadline_on).format('LLL') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-x-2 flex items-center" >
      <button class="bg-gray-200 text-black hover:bg-red-100" @click="editingTaskState = data._id" >
        Edit
      </button>
      <button class="bg-gray-200 text-black hover:bg-red-100 hover:text-red-700" @click="deleteItem()" >
        Delete
      </button>
    </div>
  </div>
</template>