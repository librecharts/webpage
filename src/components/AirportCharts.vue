<script setup lang="ts">
import ChartCard from '@/components/ChartCard.vue'
const props = defineProps({
  charts: Array<Object>
})
</script>

<template>
  <div class="px-6 py-10 gap-4 bg-space-blue flex flex-col items-center">
    <ul class="type-selector">
      <li><a href="">GEN</a></li>
      <li class="selected"><a href="">GRND</a></li>
      <li><a href="">DEPT</a></li>
      <li><a href="">ARRIV</a></li>
      <li><a href="">APPR</a></li>
    </ul>
    <div class="w-full flex flex-col gap-2">
      <ChartCard v-for="chart in charts" :chart="chart"></ChartCard>
    </div>
  </div>
</template>

<style scoped></style>
