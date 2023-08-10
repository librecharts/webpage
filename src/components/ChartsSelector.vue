<template>
  <div class="mx-1 p-2 w-full flex flex-col">
    <ul class="airport-selector">
      <li>&starf;</li>
      <li v-for="airport in airports">{{ airport }}</li>
    </ul>
    <AirportCharts :charts="[{ name: 'Aerodrome Chart' }, { name: 'Taxi Chart' }]"></AirportCharts>
  </div>
</template>
<script setup lang="ts">
import AirportCharts from '@/components/AirportCharts.vue'
const props = defineProps({
  airports: Array<String>
})
</script>
