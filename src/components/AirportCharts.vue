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

const selectedCategory = ref(types.value ? types.value[0] : '')

// Set up default chart on component load

const emit = defineEmits(['chartSelected'])

const defaultChart = ref(chartData.value ? chartData.value[selectedCategory.value][0] : null) // Default to first chart in selected values

// @NOTE(Mauro): We use filenames to distinguish charts as filenames are per-definition unique and comparing chart objects
//               is impossible as Vue.js wraps them in a Proxy() element inside the template scope

const selectedChart = ref(defaultChart.value ? defaultChart.value.filename : null)
if (defaultChart.value) {
  emit('chartSelected', defaultChart.value)
}

// Watcher to update selected type when types are updated
watch(types, () => {
  if (types.value) {
    selectedCategory.value = types.value[0]
  }
})

// Computed to get the charts from the currently selected class
const charts = computed(() => {
  return chartData.value && selectedCategory.value ? chartData.value[selectedCategory.value] : null
})

const chartsPerRunway = computed(() => {
  if (
    selectedCategory.value == 'approach' ||
    selectedCategory.value == 'arrival' ||
    selectedCategory.value == 'departure' ||
    selectedCategory.value == 'visual'
  ) {
    const objectsByRunways = {}
    charts.value.forEach((chart) => {
      if (chart.runways) {
        ;(objectsByRunways[chart.runways.join(',')] ??= []).push(chart)
      } else {
        ;(objectsByRunways['all runways'] ??= []).push(chart)
      }
    })
    return Object.keys(objectsByRunways).length == 1 &&
      Object.keys(objectsByRunways).includes('all runways')
      ? null
      : objectsByRunways
  } else {
    return null
  }
})

const abbreviations = {
  general: 'GEN',
  visual: 'VIS',
  ground: 'GRND',
  departure: 'SID',
  arrival: 'STAR',
  approach: 'APPR',
  area: 'AREA'
}
</script>

<template>
  <div class="px-6 py-10 gap-4 bg-space-blue flex flex-col items-center h-sidebar">
    <ul class="type-selector">
      <li
        v-for="type in types"
        @click="selectedCategory = type"
        :class="type == selectedCategory ? 'selected' : ''"
      >
        <a>{{ abbreviations[type] }}</a>
      </li>
    </ul>
    <div class="w-full max-h-full flex flex-col gap-2 overflow-y-scroll">
      <template v-if="chartsPerRunway">
        <div class="space-y-2" v-for="runway in Object.keys(chartsPerRunway).sort()">
          <h1
            class="font-title text-lg text-center bg-columbia-blue p-2 text-oxford-blue uppercase"
          >
            {{ runway == 'all runways' ? '' : 'RWY' }} {{ runway.split(',').join(' & ') }}
          </h1>
          <ChartCard
            v-for="chart in chartsPerRunway[runway]"
            :chart="chart"
            :abbreviation="abbreviations[selectedCategory]"
            :hideRunway="true"
            @click="
              () => {
                $emit('chartSelected', chart)
                selectedChart = chart.filename
              }
            "
            :class="chart.filename == selectedChart ? 'selected' : ''"
          ></ChartCard>
        </div>
      </template>
      <template v-else-if="charts">
        <ChartCard
          v-for="chart in charts"
          :chart="chart"
          :abbreviation="abbreviations[selectedCategory]"
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
