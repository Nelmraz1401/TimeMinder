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
          <h1 class="text-5xl" >Tips to Manage Your Time</h1>
          <p>Join TimeMinder todat and take control of your daily routine</p>
          <p>with our comprehensive management and habit buildingn platform.</p>
        </div>
      </div>
      
      <div class="grid md:grid-cols-3 gap-3 text-center" >
          <div class="border p-2 rounded-md py-12" >
            <h3>Time Tracking</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="border p-2 rounded-md py-12" >
            <h3>Track your habits</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="border p-2 rounded-md py-12" >
            <h3>Text to Speech</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
      </div>

    </div>
  </section>
</template>