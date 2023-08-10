<script setup lang="ts">
const props = defineProps({
  name: String,
  description: String,
  icon: String
})
</script>

<template>
  <div class="bg-oxford-blue rounded-lg p-4 flex flex-row gap-5 items-center">
    <i :class="props.icon" class="text-columbia-blue m-4" style="--ggs: 1.5"></i>
    <div class="space-y-2">
      <h1 class="text-xl font-title">{{ props.name }}</h1>
      <span class="font-light prose text-inherit">{{ props.description }}</span>
    </div>
  </div>
</template>

<style scoped></style>
