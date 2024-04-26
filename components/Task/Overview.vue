<script  setup >
  import APIs from "@/services/APIs.js" 
  import { Doughnut } from 'vue-chartjs'
  import axios from "axios"
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
  import moment from "moment"
  import { useTasksStore } from '@/stores/tasks'
  const tasksStore = useTasksStore()
  const listTaskForToday = computed(() => {
    return tasksStore.list.filter(task => {
      const today = moment().format('YYYY-MM-DD');
      const taskDeadline = moment(task.deadline_on).format('YYYY-MM-DD');
      return taskDeadline === today;
    })
  })
  const tasksOverview = computed(() => tasksStore.overview)

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

  const todaysTasks = ref([])
  const isStatsLoaded = ref(false)
  let charJSDoughnut = {
    chartData: {
      labels: [
        'On Time',
        'late'
      ],
      datasets: [{
        data: [0, 0],
        backgroundColor: [
          'rgb(150, 255, 150)',
          'rgb(255, 150, 150)',
        ],
        hoverOffset: 4
      }]
    },
    chartOptions: {
      responsive: true
    }
  }

  onMounted(() => {
    tasksStore.fetchOverview()

    axios.get( APIs.TASKS_STATS ).then(res => {
      charJSDoughnut.chartData.datasets[0]['data'][0] = res.data.on_time
      charJSDoughnut.chartData.datasets[0]['data'][1] = res.data.late
      isStatsLoaded.value = true
    })
  })
</script>

<template>
  <div class="p-6 space-y-4" >

    <div>
      <label>{{ listTaskForToday.length }} Today's Tasks</label>
      <div class="space-x-2 flex overflow-x-scroll pb-2" >
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

    <div class="col-span-2" >
      <label>Your Stats</label>

      <div class="grid grid-cols-3 gap-3 mb-4" >
        <div :class="[ tasksOverview.dues > 0 ? 'text-red-500' : '' ]" class="card bg-white" >
          <div class="font-mono text-gray-400 text-xs uppercase" >Past Dues</div>
          <div class="text-3xl font-semibold" >{{ tasksOverview.dues }}</div>
        </div>
        <div class="card bg-white" >
          <div class="font-mono text-gray-400 text-xs uppercase" >Today</div>
          <div class="text-3xl font-semibold" >{{ tasksOverview.today }}</div>
        </div>
        <div class="card bg-white" >
          <div class="font-mono text-gray-400 text-xs uppercase" >Incoming</div>
          <div class="text-3xl font-semibold" >{{ tasksOverview.incoming }}</div>
        </div>
      </div>

      <div v-if="isStatsLoaded && (charJSDoughnut.chartData.datasets[0]['data'][0] !== undefined || charJSDoughnut.chartData.datasets[0]['data'][0])" class="card bg-white">
        <Doughnut
          id="my-chart-id"
          :options="charJSDoughnut.chartOptions"
          :data="charJSDoughnut.chartData"
        />
      </div>
      <div v-else class="card bg-white py-12 text-center text-gray-500 font-semibold h-72 flex items-center justify-center" >
        <div>Not enough data</div>
      </div>
    </div>

  </div>  
</template>