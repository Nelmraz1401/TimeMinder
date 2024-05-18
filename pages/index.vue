<script setup > 
  definePageMeta({
    layout: 'guest',
    middleware: 'guest'
  })
</script>

<template>
  <section class="md:h-[90vh] flex flex-col space-y-4 items-center justify-center" >
    <div class="space-y-12 px-6" >

      <div class="flex items-center justify-between flex-wrap px-5 text-center md:text-left py-12" >
        <div>
          <h1 class="text-5xl" >Manage Your Time</h1>
          <h1 class="text-5xl" >Build your Habits</h1>
          <p>Join TimeMinder todat and take control of your daily routine</p>
          <p>with our comprehensive management and habit buildingn platform.</p>
          <NuxtLink to="/signup"><button class="mt-6" >Start tracking your habits</button></NuxtLink>
        </div>
        <img src="/undraw_timeline_re_aw6g.svg" class="w-[200px] mx-auto mt-6 md:mt-0 md:w-[40%]" />
      </div>
      
      <div class="grid md:grid-cols-3 gap-3 text-center" >
          <div class="border p-2 rounded-md py-12" >
            <h3>Time Tracking</h3>
            <p>Easily monitor how you spend your time throughout the day to identify areas for improvement and boost your productivity.</p>
          </div>
          <div class="border p-2 rounded-md py-12" >
            <h3>Track your habits</h3>
            <p>Establish and maintain good habits with our intuitive tracking tools, helping you stay consistent and reach your goals.</p>
          </div>
          <div class="border p-2 rounded-md py-12" >
            <h3>Text to Speech</h3>
            <p>Convert your tasks and notes into speech, making it easier to manage your schedule hands-free and on-the-go.</p>
          </div>
      </div>

    </div>
  </section>
</template>