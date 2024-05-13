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
  const speechToText = useSpeechToText()

  const props = defineProps({
    creating: {
      type: Boolean
    }
  })

  const emits = defineEmits(['submit', 'open']);
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
      //
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
    if( !editingTaskState.value ) return

    axios.get(APIs.TASKS + `/${ editingTaskState.value }`).then(res => {
      inputs.value._id = res.data._id
      inputs.value.title = res.data.title
      inputs.value.description = res.data.description
      inputs.value.deadline_on = res.data.deadline_on
      inputs.value.repeat_on_days = res.data.repeat_on_days ?? [false ,false, false, false, false, false, false]
      inputs.value.type = res.data.type
      inputs.value.habit = res.data.habit

      emits('open')
    })
  });

  // Speech Recognition
  const speechToCreate = ref({
    step: 1,
    max: 7, // Manually calculated
  })

  function stcJump(step = 1){
    if( (step == -1 && speechToCreate.value.step == 1) || (step == 1 && speechToCreate.value.step == speechToCreate.value.max)  ) return false;
    speechToCreate.value.step += step
  }

  function parseSpeech(speech){
    console.log(`PARSING: "${ speech }"`)

    if( !props.creating || !speech ) return false;

    speech = speech.trim()
    console.log(`CREATING: "${ speech }"`)

    switch( speech.toUpperCase() ){

      // Built-in commands
      case "BACK":
        stcJump(-1)
        speechToText.value.last = speech
        return

      case "NEXT":
      case "OK":
        stcJump(1)
        speechToText.value.last = speech
        return

      case "CREATE NOW":
      case "SUBMIT IT":
      case "SUBMIT":
        submitCreate();
        speechToText.value.last = speech
        return

      // Parsing of inputs
      // Mapping of inputs based on the form input order
      default:
        const keys = ['', 'deadline_on', 'title', 'description', 'type', 'habit', 'repeat_on_days', 'repeat_until']
        const key = keys[ speechToCreate.value.step ]
        let content = speech

        if( key == 'deadline_on' ){
          content = speech.replaceAll('.', '')
          content = speech.replaceAll(' am', 'AM')
          content = speech.replaceAll(' pm', 'PM')
          content = moment(speech).toDate()
          
          if( !content ) return console.warn(`Invalid Date: ${ content }`)
        }

        if( key == 'type' ){
          let map = {
            HABIT: 0,
            TASK: 1,
          }

          content = map[ speech.toUpperCase() ]
          speechToText.value.last = content
          if( !content ) return
        }

        if( key == 'habit' ){
          habitList.value.forEach(habit => {
            if( habit.name.toUpperCase() == speech.toUpperCase() ){
              inputs.value.habit = habit._id
            }
          })
          return
        }

        if( key == 'repeat_on_days' ){
          const parsedSpeech = content.split(' ')
          const fullList = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
          fullList.forEach((day, itemIndex) => {
            parsedSpeech.forEach(parsed => {
              if( day == parsed.toUpperCase() ){
                inputs.value[key][itemIndex] = !inputs.value[key][itemIndex]
              }
            })
          })

          speechToText.value.last = speech
          return
        }

        if( key == 'repeat_until' ){
          content = speech.replaceAll('.', '')
          content = speech.replaceAll(' am', 'AM')
          content = speech.replaceAll(' pm', 'PM')
          content = moment(speech).toDate()
          
          if( !content ) return console.warn(`Invalid Date: ${ content }`)
        }

        if( key ){
          inputs.value[key] = content
          speechToText.value.last = speech
        }
        break;

    }

  }

  watch(() => speechToText.value.lastTime, () => {
    parseSpeech(speechToText.value.speech)
  })

  // End speech

  onMounted(() => {
    tasksStore.fetchSuggestions()
    habitStore.fetchHabits()
  })
</script>

<template>
  <form @submit.prevent="inputs._id ? submitEdit() : submitCreate()" class="space-y-4 pb-12" >
    <div>
      <label :class="{ 'speech-active-label': speechToCreate.step === 1 }" >Deadline <span class="text-red-500" >*</span></label>
      <VueDatePicker
        @update:model-value="tasksStore.fetchSuggestions(inputs.deadline_on)" v-model="inputs.deadline_on" :min-date="moment().toDate()" :is-24="false"
        :class="{ 'speech-active-input': speechToCreate.step === 1 }"
      />
      <p v-if="errors.deadline_on" class="input-error">{{ errors.deadline_on }}</p>
    </div>
    <div>
      <TaskSuggestions />
    </div>
    <div>
      <label :class="{ 'speech-active-label': speechToCreate.step === 2 }" >Title <span class="text-red-500" >*</span></label>
      <input :class="{ 'speech-active-input': speechToCreate.step === 2 }" class="form-input" type="text" v-model="inputs.title" />
      <p class="input-error">{{ errors.title }}</p>
    </div>
    <div>
      <label :class="{ 'speech-active-label': speechToCreate.step === 3 }" >Description <span class="text-red-500" >*</span></label>
      <textarea :class="{ 'speech-active-input': speechToCreate.step === 3 }" class="form-input" v-model="inputs.description" ></textarea>
      <p class="input-error">{{ errors.description }}</p>
    </div>
    <div>
      <label :class="{ 'speech-active-label': speechToCreate.step === 4 }" >Type <span class="text-red-500" >*</span></label>
      <select :class="{ 'speech-active-input': speechToCreate.step === 4 }" v-model="inputs.type" class="form-input">
        <option value="0" >Habit</option>
        <option value="1" >Task</option>
      </select>
    </div>
    <div v-show="inputs.type == 0" >
      <label :class="{ 'speech-active-label': speechToCreate.step === 5 }" >Link a Habit</label>
      <select :class="{ 'speech-active-input': speechToCreate.step === 5 }" v-model="inputs.habit" class="form-input" >
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
        <label :class="{ 'speech-active-label': speechToCreate.step === 6 }" >Repeat Every</label>
        <div :class="{ 'speech-active-input': speechToCreate.step === 6 }" class="flex flex-wrap space-2" >
          <label v-for="(day, dayIndex) in listOfDays" :key="day" class="p-1 border flex items-center rounded space-x-2 select-none" >
            <input type="checkbox" v-model="inputs.repeat_on_days[dayIndex]" class="focus:ring-blue-500" >
            <div>{{ day }}</div>
          </label>
        </div>
      </div>
      <div>
        <label :class="{ 'speech-active-label': speechToCreate.step === 7 }" >Until</label>
        <div>
          <input :class="{ 'speech-active-input': speechToCreate.step === 7 }" class="form-input" type="date" v-model="inputs.repeat_until" :min="moment().format('YYYY-MM-DD')" />
        </div>
      </div>
    </div>
    <div>
      <button>{{ inputs._id ? "Update" : "Create" }}</button>
    </div>
  </form>
</template>

<style scoped>
  .speech-active-label{
    @apply text-blue-500
  }
  .speech-active-input{
    @apply border-2 !border-blue-500 rounded-md;
  }
</style>