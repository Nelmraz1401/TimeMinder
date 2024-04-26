<script setup >
  definePageMeta({
    layout: 'app',
    middleware: 'auth',
  })

  const list = ref([])
</script>

<template>
  <div class="grid grid-cols-3 gap-3" > 
    <div class="col-span-2 space-y-6" >    
      <Tabs :items="['Overview', 'Calendar', 'Habits', 'List']" >
        <template #0 >
          <TaskOverview />
        </template>
        <template #1 >
          <TaskCalendar />
        </template>
        <template #2 >
          <Habit />
        </template>
        <template #3 >
          <TaskList />
        </template>
      </Tabs>
    </div>
  
    <div>
      <TaskCreate />
    </div>

    <LevelingLevelUp />
  </div>
</template>