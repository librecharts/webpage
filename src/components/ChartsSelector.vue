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
    <Suspense>
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
import { computed, ref, toRef, watch } from 'vue'

const props = defineProps({
  airports: {
    type: Array<string>,
    required: true
  }
})
watch(
  () => props.airports,
  () => {
    if (!props.airports.includes(selected.value) || selected.value === null) {
      selected.value = props.airports[0]
    }
  },
  { deep: true }
)

const selected = ref('')
</script>
