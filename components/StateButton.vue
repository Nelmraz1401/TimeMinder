<script setup >  
  const props = defineProps({
    isLoading: {
      type: Boolean,
      default: false
    }
  })
</script>


<template>
  <button :class="{'opacity-50': props.isLoading}" >
    <template v-if="!props.isLoading" >
      <slot />
    </template>
    <template v-else >
      Loading
    </template>
  </button>
</template>