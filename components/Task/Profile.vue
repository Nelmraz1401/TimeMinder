<script setup >
  import { computed, onMounted, ref } from 'vue'
  import moment from "moment"
  import { useTasksStore } from '@/stores/tasks'
  const tasksStore = useTasksStore()
  const createToggle = ref(false)
  const speechToText = useSpeechToText()

  const listTaskForToday = computed(() => {
    return tasksStore.list.filter(task => {
      const today = moment().format('YYYY-MM-DD');
      const taskDeadline = moment(task.deadline_on).format('YYYY-MM-DD');
      return taskDeadline === today;
    })
  })

  const tasksOverview = computed(() => tasksStore.overview)
  const profile = useProfile()

  function listenToOpenCreate(speech){
    speech = speech.toUpperCase()

    if( speech == 'CREATE TASK' ){
        createToggle.value = true
        speechToText.value.last = speech
    }else if( speech == 'CANCEL CREATE' ){
        createToggle.value = false
        speechToText.value.last = speech
    }
  }
</script>

<template>
  <div id="profile" class="h-[100vh]">
    <SpeechToTextListen @speech="listenToOpenCreate" />

    <div class="w-full bg-white h-[97%] rounded-[17px] mb-9 animate-easeUp transition-all duration-300 ease-in-out" :class="!createToggle ? 'to-top': 'to-display'">
        <div class="w-full flex items-center justify-between rounded-[17px] py-5 px-4 bg-[#4264D0]">
            <p class="text-white">CREATE NEW TASK</p>
            <Icon
                @click="createToggle = false"
                name="mingcute:close-circle-line"
                class="text-[2em] transition-all cursor-pointer text-blue-300" 
            />
        </div>
        <div class="px-2 md:px-7 py-2 max-h-[90vh] overflow-y-auto">
            <TaskCreate :creating="createToggle" />
        </div>
    </div>
    <div class="hidden md:block bg-white h-max rounded-[17px] mb-9">
        <div class="w-full flex items-center justify-between rounded-[17px] py-5 px-4 bg-[#4264D0]">
            <p class="text-white">MY PROFILE</p>
            <Icon
                name="tabler:edit"
                class="text-3xl transition-all cursor-pointer text-white" 
            />
        </div>
        <div class="flex items-center gap-5 p-[30px]">
            <div class="rounded-full p-5 bg-red-300 text-white">
                <p class="text-2xl font-medium">{{ profile.name ? profile.name[0] : '-' }}</p>
            </div>
            <div class="flex flex-col">
                <p class="text-lg font-medium text-black mb-0 leading-5">{{ profile.name ?? '-' }}</p>
                <p class="text-md text-gray-400">{{ profile.email ?? '-' }}</p>
            </div>
        </div>
        <div class="grid grid-cols-3 pb-4">
            <div class="flex items-center border-r gap-3 justify-start px-[30px] pb-2">
                <Icon
                    name="tabler:military-rank"
                    class="text-[40px] transition-all cursor-pointer text-orange-400" 
                />
                <div class="flex flex-col">
                    <p class="text-[0.8em] text-gray-400">LEVEL</p>
                    <p class="font-medium text-lg">{{ profile.level ?? '-' }}</p>
                </div>
            </div>
            <div class="flex items-center border-r gap-3 justify-start px-[30px] pb-2">
                <Icon
                    name="mdi:timer-check-outline"
                    class="text-[40px] transition-all cursor-pointer text-orange-400" 
                />
                <div class="flex flex-col">
                    <p class="text-[0.8em] text-gray-400">TASK DONE</p>
                    <p class="font-medium text-lg">{{ profile.task_done ?? '-' }}</p>
                </div>
            </div>
            <div class="flex items-center border-r gap-3 justify-start px-[30px] pb-2">
                <Icon
                    name="ph:user-switch"
                    class="text-[40px] transition-all cursor-pointer text-orange-400" 
                />
                <div class="flex flex-col">
                    <p class="text-[0.8em] text-gray-400">TOP HABIT</p>
                    <p class="font-medium text-lg">{{ profile.top_habit ?? '-' }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="bg-white h-max -mt-[16.8em] md:mt-0 rounded-1 md:rounded-[17px]">
        <div class="hidden md:flex w-full  items-center justify-between rounded-[17px] py-5 px-4 bg-[#4264D0]">
            <p class="text-white">YOUR TASK</p>
            <button class="font-normal rounded-[10px] bg-blue-800" @click="createToggle = true">
                <Icon
                    name="tabler:text-plus"
                    class="text-xl transition-all cursor-pointer text-white" 
                />
                    New task
            </button>
            
        </div>
        <div class="w-full">
              <div class="flex flex-col p-4">
                <p class="text-gray-700 mb-4 ml-3">{{ listTaskForToday.length }} Today's Tasks</p>
                <!-- <label>{{ listTaskForToday.length }} Today's Tasks</label> -->
                <div class="flex flex-col overflow-y-scroll h-[510px] pb-2 gap-4" >
                    <TaskItemSmall
                        style="min-width: 250px;"
                        v-for="item in listTaskForToday"
                        :data="item"
                        :key="`task-${ item._id }`" 
                    />
                    <div v-if="listTaskForToday.length == 0" class="py-24 text-center space-y-2 flex-1" >
                        <div class="text-gray-600" >Yey! No task today 🎉 </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<style>
    .to-top{
        margin-top: -100vh;
        opacity: 0;
    }

    .to-display{
        margin-top: 0px;
        opacity: 1;
    }
</style>