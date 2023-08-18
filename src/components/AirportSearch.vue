<script setup lang="ts">
import * as airports from 'airport-data'
import { getICAOCodes } from '@/api'
import { computed, ref } from 'vue'

const input = ref<string>('')

const systemIcaoCodes = await getICAOCodes()
const systemAirports = airports.default.filter((airport) =>
  systemIcaoCodes.value.includes(airport.icao)
)
const placeholder = computed(() => {
  return `ex. ${systemIcaoCodes.value[Math.floor(Math.random() * systemIcaoCodes.value.length)]}`
})
const results = computed(() => {
  const value = input.value
  return input.value != ''
    ? systemAirports.filter(
        (airport) =>
          airport.name.toLowerCase().includes(value.toLowerCase()) ||
          airport.icao.startsWith(value.toUpperCase()) ||
          airport.country.toLowerCase().includes(value.toLowerCase()) ||
          airport.city.toLowerCase().includes(value.toLowerCase())
      )
    : null
})
</script>

<template>
  <div class="flex flex-col w-full gap-y-5">
    <label class="form-element md:w-1/2">
      <input type="text" name="airport" v-model="input" :placeholder="placeholder" />
    </label>
    <div
      v-if="results"
      class="z-50 position-relative border-columbia-blue border-dashed p-4 rounded-lg border-2 border-opacity-20 space-y-2 h-96 overflow-y-scroll"
      :class="results.length > 0 ? '' : 'center'"
    >
      <span v-if="results.length == 0" class="uppercase text-gray-600 font-title"
        >NO AIRPORTS FOUND</span
      >
      <div v-else v-for="airport in results" @click="$emit('selectedAirport', airport.icao)">
        <div
          class="bg-oxford-blue px-4 py-2 rounded-lg select-none cursor-pointer darken-hover flex flex-row items-center gap-x-4"
        >
          <i class="gg-pin text-columbia-blue"></i>
          <div class="space-y-1">
            <h1 class="text-xl">{{ airport.name }}</h1>
            <div class="flex flex-row gap-2 text-sm font-title">
              <span class="font-light">{{ airport.city }}, {{ airport.country }}</span>
              <span class="uppercase">{{ airport.icao }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
