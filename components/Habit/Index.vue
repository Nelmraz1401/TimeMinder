<script setup >
  import { useHabitsStore } from '@/stores/habits'
  import { defineProps, onMounted } from 'vue'

  const habitStore = useHabitsStore()
  const habitList = computed(() => habitStore.list)
  const isMobileView = ref(false); // Adjust the breakpoint as needed


  onMounted(async ()=>{
    isMobileView.value = window.innerWidth <= 900

      console.log(await habitList.value)
  })

    // Define props
  const props = defineProps({
    isMain: Boolean, // Example prop declaration
    // Add more props as needed
  })

  function addSuffix(num) {
    // Get the last digit of the number
    const lastDigit = num % 10;
    
    // Get the last two digits of the number
    const lastTwoDigits = num % 100;
    
    // Check for special cases: 11th, 12th, 13th
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return num + "th";
    }

    // Otherwise, assign suffix based on last digit
    switch (lastDigit) {
        case 1:
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd";
        default:
            return num + "th";
    }
}

  /**
   * Compute the habit leve based on its experience
   * 
   * Formula:
   *   divisor = 5
   *   Math.ceil(experience / divisor)
   * 
   * @param {Number} experience - Users experience
   * @return {String|Number}
   */
  function computeHabit(experience, divisor = 2){
    if( experience === 0 ) return "New"

    return Math.ceil( experience / divisor )
  }

</script>

<template>
  <div class="space-y-4 py-5 px-5 md:px-[30px]" >
    <p class="font-semibold text-xl">Habit Ranking</p>
    <div class="text-xs text-gray-500 mt-0 pt-0" style="margin-top: 0px;" >This is based on your everday activity</div>
    <div
      v-if="isMain"  
      class="habit-item md:mx-auto grid grid-cols-5 md:flex p-4 md:pl-0"
      v-for="(habit, habitIndex) in habitList" :key="`habit-${ habit._id }`"
    >
      <div class="text-center w-[50px]" >
        <div class="text-xs text-gray-400" >LVL</div>
        <div class="font-semibold text-lg" >{{ computeHabit(habit.experience) }}</div>
      </div>
      <div class="col-span-4">
        <input
          @keyup.enter="habit._id ? habitStore.updateHabit(habitIndex) : habitStore.createHabit()"
          type="text"
          v-model="habitList[habitIndex]['name']"
          placeholder="Enter name of the habit"
        >
      </div>
      <div v-if="habit._id" class="statistic col-span-3 space-x-4 flex -ml-[6em] md:justify-center items-center flex-1" >
        <div class="text-xs text-gray-400" >Done</div>
        <div class="font-semibold" >{{ habit.tasks_finished }}</div>
        <div class="text-gray-200" >/</div>
        <div class="font-semibold" >{{ habit.tasks_total }}</div>
        <div class="text-xs text-gray-400" >Total</div>
      </div>
      <div class="col-span-2 flex flex-1 space-x-2 justify-end" >
        <div
          class="transition-all opacity-0"
          :class="{'!opacity-100': habit.name != habit.name_old}"
          @click="habit._id ? habitStore.updateHabit(habitIndex) : habitStore.createHabit()"
        >
          <Icon
            name="mdi:check-circle-outline"
            class="text-3xl transition-all cursor-pointer text-blue-500" 
          />
        </div>
        <div
          v-show="habit._id"
          :class="{'!opacity-100': habit.name != habit.name_old}"
          @click="habitStore.deleteHabit(habitIndex)" >
          <Icon
            name="mdi:close-circle-outline"
            class="text-3xl transition-all cursor-pointer text-gray-400" 
          />
        </div>
      </div>
    </div>

    <div
      v-else
      class="habit-item flex p-4 md:pl-0"
      v-for="(habit, habitIndex) in habitList.slice(0,2)" :key="`habits-${ habit._id }`"
    >
      <div class="text-center w-[50px]  bg-blue-700 text-white" >
        {{addSuffix(habitIndex+1)}}
      </div>
      <div>
        <input
          @keyup.enter="habit._id ? habitStore.updateHabit(habitIndex) : habitStore.createHabit()"
          type="text"
          v-model="habitList[habitIndex]['name']"
          placeholder="Enter name of the habit"
        >
      </div>
      <div v-if="habit._id" class="space-x-4 flex justify-center items-center flex-1" >
        <div class="text-xs text-gray-400" >Done</div>
        <div class="font-semibold" >{{ habit.tasks_finished }}</div>
        <div class="text-gray-200" >/</div>
        <div class="font-semibold" >{{ habit.tasks_total }}</div>
        <div class="text-xs text-gray-400" >Total</div>
      </div>
      <div class="text-center w-[50px]" >
        <div class="text-xs text-gray-400" >LVL</div>
        <div class="font-semibold text-lg" >{{ computeHabit(habit.experience) }}</div>
      </div>
    </div>
  
    
  </div>
</template>

<style scoped>
  .habit-item{
    @apply  items-center space-x-6 border rounded-lg bg-white;
  }

  .habit-item input{
    @apply ring-0 border-none focus:outline-none focus:border-none focus:border focus:border-blue-300;
  }

  .habit-item-controls{
    @apply opacity-0 transition-all;
  }

  .habit-item:hover .habit-item-controls{
    opacity: 1;
  }

  @media screen and (max-width: 900px) {
    .statistic{
      background-color: #ededed;
      padding: 2px 10px;
      border-radius: 5px;
      margin-left: -1px;
      margin-bottom: -3em;
    }
  }
</style>