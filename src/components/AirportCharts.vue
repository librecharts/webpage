<script setup lang="ts">
import ChartCard from '@/components/ChartCard.vue'
import { computed, ref, toRef } from 'vue'
import { getCategorizedChartsByICAOCode } from '@/api'

const props = defineProps({
  airport: {
    type: String,
    required: true
  }
})

const selected = ref('')
const selectedChart = ref()
const chartData = await getCategorizedChartsByICAOCode(toRef(props, 'airport'))
const types = Object.keys(chartData.value)
selected.value = types[0]
const charts = computed(() => {
  return chartData.value[selected.value]
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

defineEmits(['chartSelected'])
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
    </div>
  </div>
</template>

<style scoped></style>
