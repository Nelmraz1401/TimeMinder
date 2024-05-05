<script setup >
  import moment from "moment"
  
  import { useTasksStore } from '@/stores/tasks'
  const tasksStore = useTasksStore()
  const sortedTasks = computed(() => tasksStore.listInCalendarSorted)
  
  const listOfDays = ref(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'])

  let activeMonth = moment()
  const emptyPrefixDay = ref(0)
  const numberOfDays = ref(0)
  const prefixDate = ref('')

  /**
   * Change current month
   * 
   * @param {Number} move 
   */
  async function changeMonth(move){
    activeMonth.add(move, 'month')
    
    emptyPrefixDay.value = activeMonth.startOf('month').day()
    numberOfDays.value = activeMonth.daysInMonth()
    prefixDate.value = activeMonth.format('YYYY-MM-')

    await tasksStore.setActiveMonth(activeMonth.clone())
    await tasksStore.fetchTasksForCalendar()
  }

  onMounted(() => {
    changeMonth(0)
  })
</script>

<template>
  <div class="p-5">
    <div class="flex justify-between uppercase">
      <div @click="changeMonth(-1)" class="select-none cursor-pointer p-2 text-center" >
        <span>
          <Icon
              name="mingcute:arrow-left-fill"
              class="text-2xl transition-all cursor-pointer text-gray-400" 
          />
        </span> 
        {{ activeMonth.clone().subtract(1, 'month').format('MMMM') }}
      </div>
      <div class="p-2 text-center text-lg font-semibold" >{{ activeMonth.format('MMMM YYYY') }}</div>
      <div @click="changeMonth(1)" class="select-none cursor-pointer p-2 text-center" >
        {{ activeMonth.clone().add(1, 'month').format('MMMM') }} 
        <span>
          <Icon
              name="mingcute:arrow-right-fill"
              class="text-2xl transition-all cursor-pointer text-gray-400" 
          />
        </span> 
      </div>
    </div>

    <div class="grid grid-cols-7 bg-white rounded-[17px] p-5" >
      <div class="text-center py-2" v-for="day in listOfDays" :key="day" >{{ day }}</div>
      <div v-for="prefix in emptyPrefixDay" :key="`prefix-${ prefix }`" ></div>
      <div
        class="calendar-box h-[7em] md:h-32 overflow-hidden"
        v-for="actualDay in numberOfDays"
        :key="`actual-dates-${ actualDay }`"
        :class="{
          'bg-blue-100 font-bold': prefixDate + actualDay == moment().format('YYYY-MM-D')
        }"
      >
        <div class="p-1" >{{  actualDay  }}</div>
        
        <div class="flex flex-wrap gap-2 m-1 absolute" >
          <div 
            v-for="(task, taskID) in sortedTasks[`${ prefixDate }${ String(actualDay).padStart(2, 0) }`]" :key="`acd-${ actualDay }-${ taskID }`"
            class="p-0.5 bg-gray-300 px-2 text-xs rounded"
            :class="{
              '!bg-red-300': !task.finished_on && moment(task.deadline_on).valueOf() < moment().valueOf(),
              '!bg-blue-300': task.finished_on,
            }"
          >
            {{ task.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .calendar-box{
    @apply border relative;
  }
</style>