<template>
  <div
    class="chart-card bg-oxford-blue rounded-sm flex flex-row items-center gap-10 p-4 flex-grow select-none cursor-pointer"
  >
    <div class="w-5">
      <i :class="icons[props.chart.type]" style="--ggs: 0.8"></i>
    </div>
    <template v-if="chart.type == 'ground'">
      <div>
        <h1 class="text-lg font-medium">{{ chart.subtype }}</h1>
        <span class="text-xs font-title font-light">{{ chart.title }}</span>
      </div>
    </template>
    <template
      v-else-if="chart.type == 'arrival' || chart.type == 'departure' || chart.type == 'approach'"
    >
      <div>
        <h1 class="text-lg font-thin capitalize">
          <span v-if="chart.runways">
            <span class="font-medium">
              <template v-if="!props.hideRunway">
                RWY
                <span class="font-title text-columbia-blue">
                  {{ chart.runways.length > 1 ? chart.runways.join(',') : chart.runways[0] }}
                </span>
              </template>
            </span>
          </span>
          <div class="font-medium">
            <span class="text-columbia-blue">{{ chart.subtype ? chart.subtype : '' }} </span>
            {{ abbreviation }}
          </div>
        </h1>
        <div class="flex flex-row text-xs gap-3 font-title font-light">
          <span v-if="chart.stars">
            {{ chart.stars.length > 1 ? chart.stars.join(',') : chart.stars[0] }}
          </span>
          <span v-if="chart.sids">
            {{ chart.sids.join(', ') }}
          </span>
        </div>
      </div>
    </template>
    <span v-else class="text-sm font-light">{{ chart.title }}</span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  chart: {
    type: Object,
    required: true
  },
  abbreviation: {
    type: String
  },
  hideRunway: Boolean
})

const icons = {
  ground: 'gg-swap',
  departure: 'gg-arrow-top-right',
  arrival: 'gg-arrow-bottom-left',
  visual: 'gg-eye',
  approach: 'gg-arrow-bottom-right',
  chart: 'gg-file-document',
  area: 'gg-trees'
}
</script>
