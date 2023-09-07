<script setup lang="ts">
import { computed, toRef } from 'vue'
import { getCoverageStatistics, getICAOCodes } from '@/api'

const props = defineProps({
  provider: {
    type: String,
    required: true
  }
})

const currentProvider = toRef(props, 'provider')
const statisticsData = await getCoverageStatistics(currentProvider)
const icaoCodes = await getICAOCodes()

function getCoverage(array: Array<string>): number {
  /**
   * Returns the intersection array's length for a given array of ICAO codes
   * @param array An array containing ICAO codes
   *
   */
  let intersectedArray: string[]
  array = [...new Set(array)]
  intersectedArray = array.filter((airport) => icaoCodes.value.includes(airport))
  return intersectedArray.length
}

const coverage = computed(() => {
  return {
    arrival_and_departure: {
      array: [
        ...new Set(
          Array.prototype.concat(
            statisticsData.value.arrival_airports,
            statisticsData.value.departure_airports
          )
        )
      ],
      coverage: getCoverage(
        Array.prototype.concat(
          statisticsData.value.arrival_airports,
          statisticsData.value.departure_airports
        )
      )
    },
    arrival_or_departure: {
      array: [
        ...new Set(
          Array.prototype.concat(
            statisticsData.value.arrival_airports,
            statisticsData.value.departure_airports
          )
        )
      ],
      coverage:
        getCoverage(statisticsData.value.arrival_airports) +
        getCoverage(statisticsData.value.arrival_airports)
    },
    at_least_one: {
      array: [
        ...new Set(
          Array.prototype.concat(
            statisticsData.value.arrival_airports,
            statisticsData.value.departure_airports,
            statisticsData.value.alternate_airports
          )
        )
      ],
      coverage:
        getCoverage(statisticsData.value.arrival_airports) +
        getCoverage(statisticsData.value.arrival_airports) +
        getCoverage(statisticsData.value.alternate_airports)
    }
  }
})
</script>

<template>
  <div v-if="coverage.arrival_and_departure.coverage" class="statistics">
    <div class="statistic">
      <span class="value">{{
        Math.round(
          (coverage.arrival_and_departure.coverage / coverage.arrival_and_departure.array.length) *
            100
        )
      }}</span>
      <span class="name">Departure & Arrival</span>
    </div>
    <div class="statistic">
      <span class="value">{{
        Math.round(
          (coverage.arrival_or_departure.coverage / coverage.arrival_or_departure.array.length) *
            100
        )
      }}</span>
      <span class="name">Departure or Arrival</span>
    </div>
    <div class="statistic">
      <span class="value">{{
        Math.round(
          (coverage.arrival_or_departure.coverage / coverage.arrival_or_departure.array.length) *
            100
        )
      }}</span>
      <span class="name">At least one Airport</span>
    </div>
  </div>
  <div class="text-center" v-else>
    <span class="text-xl uppercase text-gray-600">No flights found</span>
  </div>
</template>

<style scoped></style>
