<script  setup >
  import APIs from "@/services/APIs.js" 
  import { Doughnut, Radar } from 'vue-chartjs'
  import axios from "axios"
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js'
  import moment from "moment"
  import { useTasksStore } from '@/stores/tasks'
  import bg from '../../public/sec.png'
  import { onMounted } from "vue"
  const tasksStore = useTasksStore()
  const listTaskForToday = computed(() => {
    return tasksStore.list.filter(task => {
      const today = moment().format('YYYY-MM-DD');
      const taskDeadline = moment(task.deadline_on).format('YYYY-MM-DD');
      return taskDeadline === today;
    })
  })
  const tasksOverview = computed(() => tasksStore.overview)
  const profile = useProfile()

      // Define props
  const props = defineProps({
    isDashboardOnly: Boolean, // Example prop declaration
    // Add more props as needed
  })

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, RadialLinearScale, PointElement, LineElement, Filler)

  const todaysTasks = ref([])
  const isStatsLoaded = ref(false)
  let chartJSDoughnut = {
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

  let chartJSRadar = {
    chartData: {
      labels: [''],
      datasets: [
        {
          label: '',
          data: [0],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        },
        {
          label: '',
          data: [0],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        },
        {
          label: '',
          data: [0],
          fill: true,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgb(255, 206, 86)',
          pointBackgroundColor: 'rgb(255, 206, 86)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 206, 86)'
        },
        {
          label: '',
          data: [0],
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(75, 192, 192)'
        }
      ]
    },
    chartOptions: {
      responsive: true,
      scale: {
        ticks: {
          stepSize: 2
        }
      }
    }
  }

  onMounted(() => {
    tasksStore.fetchOverview()

    axios.get( APIs.TASKS_STATS ).then(res => {
      chartJSDoughnut.chartData.datasets[0]['data'][0] = res.data.on_time
      chartJSDoughnut.chartData.datasets[0]['data'][1] = res.data.late
      
      chartJSRadar.chartData.labels = res.data.habits.list

      for (let index = 0; index < 4; index++) {
        chartJSRadar.chartData.datasets[index]['label'] = res.data.habits.weeks[0]['label']
        chartJSRadar.chartData.datasets[index]['data']  = res.data.habits.weeks[0]['data']
      }

      isStatsLoaded.value = true
    })
  })

  const currentTime = ref('-');
  onMounted(() => {
    setInterval(() => {
      currentTime.value = moment().format('MMMM D, YYYY, h:mm A')
    }, 5);
  })
</script>

<template>
  <div :class="isDashboardOnly ? 'p-0':'px-1 md:px-6 space-y-4'">
    <template v-if="!isDashboardOnly">
      <div class="banner-main flex flex-col justify-between p-8 items-start w-full md:rounded-[17px] h-[180px]  md:h-[250px] img-assistant  mb-2 md:mb-7" :style="`background-image: url(${bg})`">
          <div class="flex gap-2 bg-blue-500 rounded-md py-[6px] px-4">
            <Icon
              name="fluent:calendar-12-filled"
              class="text-xl transition-all cursor-pointer text-blue-200" 
            />
            <p class="text-sm text-white">{{ currentTime }}</p>
          </div>
          <div class="flex flex-col text-white">
            <p class="text-2xl font-medium">Good Day, {{ profile.name }}!</p>
            <p class="desktop text-blue-200 w-[100%] md:w-[60%]">Don't forget to complete your tasks for the day and take a moment to review the statistics  to track your progress effectively. Have a nice monday!</p>
            <p class="mobile text-blue-200 w-[100%] md:w-[60%]">Don't forget to complete your tasks.</p>
          </div>
        </div>
        
      <div class="grid grid-cols-3 gap-3 md:gap-7 mb-5 px-2 md:p-0" >
        <div :class="[ tasksOverview.dues > 0 ? 'text-red-500' : '' ]" class="cardesh p-4 h-max md:h-[150px] md:p-[20px] bg-white flex justify-between">
          <div>
            <div class="text-gray-400 text-xs uppercase" >Past Dues</div>
            <div class="text-[2.5em] md:text-[3.5em] font-semibold" >{{ tasksOverview.dues }}</div>
          </div>
          <div class="hidden md:inline-block">
            <Icon
              name="tabler:arrow-bounce"
              class="text-[2em] md:text-[7em] transition-all cursor-pointer text-blue-200" 
            />
          </div>
        </div>
        <div class="cardesh p-4 h-max md:h-[150px] md:p-[20px] bg-white flex justify-between" >
          <div>
            <div class="text-gray-400 text-xs uppercase" >Today</div>
            <div class="text-[2.5em] md:text-[3.5em] font-semibold" >{{ tasksOverview.today }}</div>
          </div>
          <div class="hidden md:inline-block">
            <Icon
              name="fluent:arrow-enter-16-filled"
              class="hidden md:inline-block text-[2em] md:text-[7em] transition-all cursor-pointer text-red-200" 
            />
          </div>
        </div>
        <div class="cardesh h-max md:h-[150px] p-4 md:p-[20px] bg-white flex justify-between" >
          <div>
            <div class="text-gray-400 text-xs uppercase" >Incoming</div>
            <div class="text-[2.5em] md:text-[3.5em] font-semibold" >{{ tasksOverview.incoming }}</div>
          </div>
          <div class="hidden md:inline-block">
            <Icon
              name="fluent:arrow-enter-16-filled"
              class="text-[2em] md:text-[7em] transition-all cursor-pointer text-red-200" 
            />
          </div>
        </div>
      </div>
      <div class="col-span-2 mt-2 px-2 md:px-0 md:mt-5" >
      <div v-if="isStatsLoaded && (chartJSDoughnut.chartData.datasets[0]['data'][0] !== undefined || chartJSDoughnut.chartData.datasets[0]['data'][0])" class="cardesh2 p-5 hidden md:block md:p-[30px]   md:bg-white -mt-4 md:mt-[2em]" >
        <p class="text-lg font-medium">Your Stats</p>
        <p class="text-sm text-gray-400 mb-5">Based on Jan-15-2024 - Current data</p>
        <div class="grid grid-cols-2 gap-5 overflow-x-auto overflow-y-hidden md:w-full " >
          <div class="h-[300px] flex justify-center items-center flex-col">
            <div class="text-center p-2 uppercase" >
              <label>All Time Stats</label>
            </div>
            <Doughnut 
              id="my-chart-id"
              :options="chartJSDoughnut.chartOptions"
              :data="chartJSDoughnut.chartData"
            />
          </div>
          <div class="h-[300px] flex justify-center items-center flex-col">
            <div class="text-center p-2 uppercase" >
              <label>Month Stats</label>
            </div>
            <Radar
              id="my-chart-id"
              :options="chartJSRadar.chartOptions"
              :data="chartJSRadar.chartData"
            />
          </div>
        </div>
      </div>
      <div v-else class="card bg-white py-12 text-center text-gray-500 font-semibold h-72 flex items-center justify-center" >
        <div>Not enough data</div>
      </div>
    </div>

    </template>
    <template v-else>
      <div v-if="isStatsLoaded && (chartJSDoughnut.chartData.datasets[0]['data'][0] !== undefined || chartJSDoughnut.chartData.datasets[0]['data'][0])" >
        <div class="grid grid-cols-2 gap-5" >
          <div class="flex justify-center items-center bg-white h-[330px] w-[330px]">
            <div class="text-center p-2 uppercase" >
              <label>All Time Stats</label>
            </div>
            <Doughnut
              id="my-chart-id"
              :options="chartJSDoughnut.chartOptions"
              :data="chartJSDoughnut.chartData"
            />
          </div>
          <div class="flex justify-center items-center  bg-white h-[330px] w-[330px]">
            <div class="text-center p-2 uppercase" >
              <label>Month Stats</label>
            </div>
            <Radar
              id="my-chart-id"
              :options="chartJSRadar.chartOptions"
              :data="chartJSRadar.chartData"
            />
          </div>
        </div>
      </div>
    </template>
    

  </div>  
</template>
<style scoped>
  .img-assistant{
    background-position: right;
    background-size: 90%;
    background-repeat: no-repeat;
    background-color: #4264d0;
  }
  .cardesh{
    border-radius: 17px;
  }

  .cardesh2{
    border-radius: 17px;
    position: relative;
    height: 450px;
  }

  .mobile{
    display: none;
  }

  .desktop{
      display: block;
    }

  @media screen and (max-width: 768px) {
    .banner-main{
      background-size: cover;
      background-position-x: -200px;
      /* background-image: url('') !important; */
    }
    .desktop{
      display: none;
    }

    .mobile{
      display: block;
    }
  }

 
</style>