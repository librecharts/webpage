<script setup lang="ts">
import ChartCard from '@/components/ChartCard.vue'
import { computed, ref, toRef, watch } from 'vue'
import { getCategorizedChartsByICAOCode } from '@/api'

const props = defineProps({
  airport: {
    type: String,
    required: true
  }
})
const currentAirport = toRef(props, 'airport') // Convert to ref to ensure reactivity

const chartData = await getCategorizedChartsByICAOCode(currentAirport) // Get chart data from API
const types = computed(() => {
  return chartData.value ? Object.keys(chartData.value) : null
})

const selected = ref(types.value ? types.value[0] : '')

// Set up default chart on component load

const emit = defineEmits(['chartSelected'])

const defaultChart = ref(chartData.value ? chartData.value[selected.value][0] : null)
const selectedChart = ref(defaultChart.value ? defaultChart.value.filename : null)
if (defaultChart.value) {
  emit('chartSelected', defaultChart.value)
}

watch(types, () => {
  if (types.value) {
    selected.value = types.value[0]
  }
})
const charts = computed(() => {
  return chartData.value && selected.value ? chartData.value[selected.value] : null
})

const abbreviations = {
  chart: 'GEN',
  visual: 'VIS',
  ground: 'GRND',
  departure: 'DEPT',
  arrival: 'ARRIV',
  approach: 'APPR',
  area: 'AREA'
}

watch(currentAirport, () => {
  console.log(currentAirport.value)
})
</script>

<template>
  <div class="px-6 py-10 gap-4 bg-space-blue flex flex-col items-center">
    <ul class="type-selector">
      <li
        v-for="type in types"
        @click="selected = type"
        :class="type == selected ? 'selected' : ''"
      >
        <a>{{ abbreviations[type] }}</a>
      </li>
    </ul>
    <div class="w-full max-h-full flex flex-col gap-2 overflow-scroll">
      <template v-if="charts">
        <ChartCard
          v-for="chart in charts"
          :chart="chart"
          @click="
            () => {
              $emit('chartSelected', chart)
              selectedChart = chart.filename
            }
          "
          :class="chart.filename == selectedChart ? 'selected' : ''"
        ></ChartCard>
      </template>
      <div class="center space-y-4" v-else>
        <span><i class="gg-spinner-alt"></i></span>
        <span class="text-sm uppercase font-light text-gray-500">Loading Charts</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
