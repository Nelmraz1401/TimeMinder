<script setup >
  import { useHabitsStore } from '@/stores/habits'

  const habitStore = useHabitsStore()
  const habitList = computed(() => habitStore.list)

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
  <div class="space-y-4 py-24" >
    
    <div
      class="habit-item"
      v-for="(habit, habitIndex) in habitList" :key="`habit-${ habit._id }`"
    >
      <div class="text-center w-[50px]" >
        <div class="text-xs text-gray-400" >LVL</div>
        <div class="font-semibold text-lg" >{{ computeHabit(habit.experience) }}</div>
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
      <div class="flex flex-1 space-x-2 justify-end" >
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
  
    
  </div>
</template>

<style scoped>
  .habit-item{
    @apply p-4 flex items-center space-x-6 border bg-white w-[700px] mx-auto;
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
</style>