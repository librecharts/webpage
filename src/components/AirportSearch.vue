<script setup lang="ts">
import { getAirports, getICAOCodes } from '@/api'
import { computed, ref } from 'vue'
const input = ref<string>('')
const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
const systemIcaoCodes = await getICAOCodes()
const selectedAirport = ref<string>('')
const airports = await getAirports()
const systemAirports = airports.value.filter((airport) =>
  systemIcaoCodes.value.includes(airport.ident)
)
const placeholder = computed(() => {
  return `ex. ${systemIcaoCodes.value[Math.floor(Math.random() * systemIcaoCodes.value.length)]}`
})
const results = computed(() => {
  const value = input.value
  return input.value != ''
    ? systemAirports
        .filter(
          (airport) =>
            airport.name.toLowerCase().includes(value.toLowerCase()) ||
            airport.ident.startsWith(value.toUpperCase()) ||
            airport.ident == value.toLowerCase() ||
            regionNamesInEnglish
              .of(airport.iso_country)
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            airport.keywords
              .toLowerCase()
              .split(',')
              .find((a) => a.includes(value.toLowerCase())) ||
            airport.municipality.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 100) // Limit to 100 responses
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
      <div class="flex flex-col text-center text-gray-600" v-if="results.length == 0">
        <span class="uppercase font-title">NO AIRPORTS FOUND</span>
        <span class="text-xs font-light"
          >Hint: Can't find your favourite airport, ask for it to be added
          <a class="dotted-link" href="https://github.com/librecharts/charts/issues/new">here</a
          >.</span
        >
      </div>

      <div
        v-else
        v-for="airport in results"
        @click="
          () => {
            $emit('selectedAirport', airport.ident)
            selectedAirport = airport.ident
          }
        "
      >
        <div
          class="bg-oxford-blue px-4 py-2 rounded-lg select-none cursor-pointer darken-hover flex flex-row items-center gap-x-4"
        >
          <i class="gg-pin text-columbia-blue"></i>
          <div class="space-y-1">
            <h1 class="text-xl">
              {{ airport.name }}
            </h1>
            <div class="flex flex-row gap-2 text-sm font-title">
              <span class="font-light"
                >{{ airport.municipality ? airport.municipality + ',' : '' }}
                {{ regionNamesInEnglish.of(airport.iso_country) }}</span
              >
              <span class="uppercase">{{ airport.ident }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="results.length > 5" class="text-center uppercase text-xs text-gray-600">
        Showing the first {{ results.length }} results
      </div>
    </div>
  </div>
</template>

<style scoped></style>
