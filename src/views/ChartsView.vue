<template>
  <section class="w-screen h-screen flex flex-row overflow-hidden">
    <div class="bg-oxford-blue flex flex-col transition-all duration-500 w-96 h-full">
      <div class="bg-space-blue center">
        <RouterLink to="/" class="darken-hover"
          ><LogoSvg class="nav-logo-long"></LogoSvg
        ></RouterLink>
      </div>
      <div class="p-4 space-y-10">
        <div class="horizontal-center">
          <div class="flex flex-col items-end">
            <div class="flex flex-row gap-3 items-center font-title">
              <label>
                <input type="text" class="airport-input" v-model="originInput" placeholder="ORIG" />
              </label>
              <div>
                <i class="gg-arrow-long-right"></i>
              </div>
              <label>
                <input
                  type="text"
                  class="airport-input"
                  v-model="destinationInput"
                  placeholder="DEST"
                />
              </label>
            </div>
            <div v-if="alternate" class="flex flex-row gap-3 items-center font-title">
              <div class="w-6">
                <i class="gg-corner-down-right"></i>
              </div>
              <label>
                <input
                  type="text"
                  class="airport-input"
                  v-model="alternateInput"
                  placeholder="ALTN"
                />
              </label>
            </div>
          </div>
        </div>
        <ChartsSelector
          @chartSelected="(chart) => (selectedChart = chart)"
          v-if="airports.length > 0"
          :airports="airports"
        ></ChartsSelector>
        <div v-else class="mx-1 bg-space-blue text-center w-80 center">
          <span class="m-12 font-light">No Airports Selected</span>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col">
      <PDFViewer v-if="selectedChart" :chart="selectedChart"></PDFViewer>
      <div v-else class="w-full h-full center">
        <div class="p-10 bg-oxford-blue rounded-lg center space-y-2">
          <RouterLink to="/" class="darken-hover"><LogoSvg class="w-16 h-16"></LogoSvg></RouterLink>
          <h1 class="text-2xl uppercase text-columbia-blue">No chart selected</h1>
          <div class="horizontal-center space-y-2 mt-5">
            <div class="flex flex-row gap-x-4 font-light text-gray-300">
              <a class="dotted-link" href="https://github.com/librecharts">Github</a>
              <a class="dotted-link" href="">Discord</a>
              <a class="dotted-link" href="">API</a>
            </div>
            <span class="text-sm uppercase font-light text-gray-500"
              >NAVIGATE. INFORMED. ANYWHERE.</span
            >
          </div>
        </div>
      </div>
      <footer v-if="selectedChart" class="flex flex-row bg-oxford-blue w-full justify-between">
        <div class="p-2 px-4 bg-space-blue flex flex-row items-center gap-4">
          <img
            :src="'https://avatars.githubusercontent.com/' + selectedChart.source.contributor"
            class="w-4 h-4 rounded-sm"
          />
          <div class="flex flex-row gap-1">
            <span class="font-thin">Contributed by</span>
            <a :href="'https://github.com/' + selectedChart.source.contributor">{{
              selectedChart.source.contributor
            }}</a>
          </div>
        </div>
        <div class="p-2 center horizontal-center">
          <span
            >All charts displayed herein are <strong>for simulation use only</strong> and
            <strong>should not be used for real navigation</strong>.</span
          >
        </div>
        <div class="p-2 px-4 bg-space-blue flex flex-row items-center gap-1">
          <CloudIcon class="w-5 h-5 text-light-cyan"></CloudIcon>
          <span class="font-thin">Source</span>
          <a :href="selectedChart.source.url" target="_blank">{{ selectedChart.source.name }}</a>
        </div>
      </footer>
    </div>
  </section>
</template>
<script setup lang="ts">
import LogoSvg from '@/components/img/LogoSvg.vue'
import ChartsSelector from '@/components/ChartsSelector.vue'
import { computed, ref } from 'vue'
import { useRouteParams, useRouteQuery } from '@vueuse/router'
import { debouncedRef } from '@vueuse/core'
import { getChartFromCache } from '@/api'
import { CloudIcon } from '@heroicons/vue/24/outline'
import PDFViewer from '@/components/PDFViewer.vue'

let route = useRouteParams('route', null)
let origin = useRouteQuery('origin', null)
let destination = useRouteQuery('destination', null)
let alternate = useRouteQuery('alternate', null)

let originInput = debouncedRef(origin, 1000)
let destinationInput = debouncedRef(destination, 1000)
let alternateInput = debouncedRef(alternate, 1000)

const airports = computed(() => {
  return [originInput, destinationInput, alternateInput]
    .map((r) => r.value)
    .filter((value) => value != null && value !== '' && value.length == 4)
})

const selectedChart = ref(null)
const selectedAirport = ref(airports.value[0])
</script>
