<script setup >
  import { useRoute } from 'vue-router';
  import { ref, onMounted  } from 'vue';
  definePageMeta({
    layout: 'app',
    middleware: 'auth',
  })
  const route = useRoute();
  const selectedTabIndex = ref(0); // Initialize with the default selected tab index
  const isMobileView = ref(false); // Adjust the breakpoint as needed

   // Update isMobileView when the window is resized
   const handleResize = () => {
    isMobileView.value = window.innerWidth <= 900; // Adjust the breakpoint as needed
  };

  onMounted(() => {
    isMobileView.value = window.innerWidth <= 900
    window.addEventListener('resize', handleResize);
  });

   // Cleanup on component unmount
   onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

 // Function to update the selected tab index
  const updateSelectedTabIndex = (index) => {
    selectedTabIndex.value = index;
  };

  const list = ref([])
</script>

<template>
  <div class="grid md:grid-cols-3 bg-gray-100 md:p-3 grid-cols-1 h-[100%]" > 
    <div class="flex flex-col col-span-2 space-y-6" >    
      <Tabs 
        :items="[
          {name:'Overview', icon: 'mage:dashboard-chart-arrow-fill'},
          {name:'Calendar', icon: 'solar:calendar-bold'}, 
          {name:'Habits',icon:'solar:user-id-bold'}, 
          {name:'List',icon:'solar:clipboard-list-bold'}]" 
          v-on:selected="updateSelectedTabIndex"
          >
        <template #0 >
          <TaskOverview :isDashboardOnly="false"/>
        </template>
        <template #1 >
          <TaskCalendar />
        </template>
        <template #2 >
          <Habit :isMain="true" />
        </template>
        <template #3 >
          <TaskList />
        </template>
      </Tabs>
    </div>
  
    <div v-if="!isMobileView || (isMobileView && selectedTabIndex === 0)">
      <TaskProfile />
      <!-- <TaskCreate /> -->
    </div>

    <LevelingLevelUp />
  </div>
</template>