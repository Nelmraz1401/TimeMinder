<template>
  <div class="text-gray-600" >
    <nav class="p-4 bg-white h-20" >
      <div class="container flex items-center justify-between" >
        <NuxtLink to="/" class="flex space-x-2" >
          <div class="flex space-x-2 items-center text-primary-700 font-semibold" >
            <img src="/timeminder.png" class="w-12" />
            <div class="hidden md:block" >TimeMinder</div>
          </div>
        </NuxtLink>
        <div class="flex items-center space-x-6" >
          <NuxtLink to="/about" >About</NuxtLink>
          <NuxtLink to="/extra" >Tips</NuxtLink>
          <NuxtLink to="/signup" >Sign up</NuxtLink>
          <NuxtLink to="/signin" class="btn" >Sign in</NuxtLink>
        </div>
      </div>
    </nav>

    <section class="container" >
      <slot />
    </section>

    <Toast />
  </div>
</template>