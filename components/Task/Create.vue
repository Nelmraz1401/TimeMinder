<script setup > 
  import axios from "axios"
  import APIs from "@/services/APIs.js" 
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css' 
  import moment from "moment"
  import { useTasksStore } from '@/stores/tasks'
  import { onMounted } from "vue";
  import { useToastStore } from '@/stores/toast'
  import { useHabitsStore } from '@/stores/habits'
  const toastStore = useToastStore()
  const tasksStore = useTasksStore()
  const habitStore = useHabitsStore()
  const habitList = computed(() => habitStore.list.filter(item => !item.is_dummy))
  const editingTaskState = useEditingTask()

  const emits = defineEmits(['submit']);
  const listOfDays = ref(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'])
  const inputs = ref({
    title: '',
    description: '',
    deadline_on: moment(),
    repeat_on_days: [false, false, false, false, false, false, false],
    repeat_until: null,
    repeat_on_hour: '',
    type: 0,
    habit: null,
  })
  const errors = ref({})

  /**
   * Reset inputs
   * @return {null}
   */
  function resetInputs(){     
    inputs.value = {
      title: '',
      description: '',
      deadline: moment(),
      repeat_on_days: [false, false, false, false, false, false, false],
      repeat_until: null,
      type: 0,
      habit: null,
    }
  }

  /**
   * Validate "inputs" inputs
   */
  function validateInputErrors(){
    errors.value = {}
    let errorCount = 0

    if(inputs.value.title.length < 3){
      errors.value.title = 'Title must be at least 3 characters'
      errorCount++ 
    }

    if(inputs.value.description.length < 3){
      errors.value.description = 'Description must be at least 3 characters'
      errorCount++
    }

    if(inputs.value.deadline_on == null){
      errors.value.deadline_on = 'Deadline is required'
      errorCount++
    }

    return errorCount
  }

  /**
   * sbumit EDITING instance to server API
   * and refresh the list after the update
   */
  function submitEdit(){
    if( validateInputErrors() ) return
    
    axios.put(`${ APIs.TASKS }/${ inputs.value._id }`, inputs.value).then(async (res) => {
      resetInputs()
      await tasksStore.fetchTasks({ from: moment().format('YYYY-MM-DD') })
      await tasksStore.fetchTasksForCalendar()
      await tasksStore.fetchOverview()

      editingTaskState.value = null
    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * Submit NEW instance to server API
   * and refresh the list after the fetch
   */
  async function submitCreate(){
    if( validateInputErrors() ) return

    await tasksStore.addTask(inputs.value)
    resetInputs()
    toastStore.setMessage('Task created')
  }

  // Watch for editing task
  watch(editingTaskState, () => {
    console.log( editingTaskState.value )
    if( !editingTaskState.value ) return

    axios.get(APIs.TASKS + `/${ editingTaskState.value }`).then(res => {
      inputs.value._id = res.data._id
      inputs.value.title = res.data.title
      inputs.value.description = res.data.description
      inputs.value.deadline_on = res.data.deadline_on
      inputs.value.repeat_on_days = res.data.repeat_on_days
      inputs.value.type = res.data.type
      inputs.value.habit = res.data.habit
    })
  });

  onMounted(() => {
    tasksStore.fetchSuggestions()
    habitStore.fetchHabits()
  })
</script>

<template>
  <form @submit.prevent="inputs._id ? submitEdit() : submitCreate()" class="space-y-4" >
    <div>
      <label>Deadline <span class="text-red-500" >*</span></label>
      <VueDatePicker @update:model-value="tasksStore.fetchSuggestions(inputs.deadline_on)" v-model="inputs.deadline_on" :min-date="moment()" :is-24="false" />
      <p v-if="errors.deadline_on" class="input-error">{{ errors.deadline_on }}</p>
    </div>
    <div>
      <TaskSuggestions />
    </div>
    <div>
      <label>Title <span class="text-red-500" >*</span></label>
      <input class="form-input" type="text" v-model="inputs.title" />
      <p class="input-error">{{ errors.title }}</p>
    </div>
    <div>
      <label>Description <span class="text-red-500" >*</span></label>
      <textarea class="form-input" v-model="inputs.description" ></textarea>
      <p class="input-error">{{ errors.description }}</p>
    </div>
    <div>
      <label>Type <span class="text-red-500" >*</span></label>
      <select v-model="inputs.type" class="form-input">
        <option value="0" >Habit</option>
        <option value="1" >Task</option>
      </select>
    </div>
    <div v-show="inputs.type == 0" >
      <label>Link a Habit</label>
      <select v-model="inputs.habit" class="form-input" >
        <option
          v-for="habit in habitList" :key="`habits-${ habit._id }`"
          :value="habit._id"
        >
          {{ habit.name }}
        </option>
      </select>
    </div>
    <div class="space-y-4" >
      <div>
        <label>Repeat Every</label>
        <div class="flex space-x-2" >
          <label v-for="(day, dayIndex) in listOfDays" :key="day" class="p-1 border flex items-center rounded space-x-2 select-none" >
            <input type="checkbox" v-model="inputs.repeat_on_days[dayIndex]" class="focus:ring-blue-500" >
            <div>{{ day }}</div>
          </label>
        </div>
      </div>
      <div>
        <label>Until</label>
        <div>
          <input class="form-input" type="date" v-model="inputs.repeat_until" :min="moment().format('YYYY-MM-DD')" />
        </div>
      </div>
    </div>
    <div>
      <button>{{ inputs._id ? "Update" : "Create" }}</button>
    </div>
  </form>
</template>