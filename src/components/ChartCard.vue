<template>
  <div
    class="chart-card bg-oxford-blue rounded-sm flex flex-row items-center gap-4 p-4 overflow-y-scroll flex-grow"
  >
    <div>
      <i class="gg-swap"></i>
    </div>
    <div>{{ chart.name }}</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  chart: Object
})
</script>
