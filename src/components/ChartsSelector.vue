<template>
  <div class="mx-1 p-2 w-full flex flex-col">
    <ul class="airport-selector">
      <li>&starf;</li>
      <li
        v-for="airport in airports"
        :class="airport == selected ? 'selected' : ''"
        @click="selected = airport"
      >
        {{ airport }}
      </li>
    </ul>
    <Suspense timeout="0">
      <AirportCharts
        @chartSelected="(chart) => $emit('chartSelected', chart)"
        :airport="selected"
      ></AirportCharts>
      <template #fallback>
        <div class="px-6 py-10 gap-4 bg-space-blue flex flex-col items-center">
          <i class="gg-spinner-alt"></i>
        </div>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts">
import AirportCharts from '@/components/AirportCharts.vue'
import { ref, toRef, watch } from 'vue'

const props = defineProps({
  airports: {
    type: Array<string>,
    required: true
  }
})

const airports = toRef(props, 'airports') // Converting to ref to keep reactivity
const selected = ref(airports.value ? airports.value[0] : '') // Default selected to the first airport on component load
watch(airports, () => {
  if (airports.value) {
    // If no airport is selected or the selected airport is no longer in the array
    if (selected.value === '' || !airports.value.includes(selected.value)) {
      selected.value = airports.value[0] // Default to the first airport
    }
  }
})
</script>
