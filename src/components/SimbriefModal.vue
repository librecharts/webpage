<script setup lang="ts">
import FullscreenModal from '@/components/FullscreenModal.vue'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { debouncedRef, useFetch } from '@vueuse/core'

const simBriefID = ref('')
const url = ref('')
const deBouncedurl = debouncedRef(url, 1000)
const router = useRouter()

watchEffect(() => {
  if (simBriefID.value.length >= 6 && simBriefID.value.length <= 32) {
    url.value = `https://www.simbrief.com/api/xml.fetcher.php?username=${simBriefID.value}&json=1`
  }
})

const { isFetching, data, error } = await useFetch(deBouncedurl)
const flightPlan = computed(() => {
  if (error.value !== null) {
    console.log(error.value)
    return error.value
  } else {
    if (data.value !== null) {
      console.log(data.value)
      return {
        flight_number: data.value.general.icao_airline + data.value.general.flight_number,
        origin: data.value.origin.icao_code,
        destination: data.value.destination.icao_code,
        alternate: data.value.alternate.icao_code,
        route: data.value.general.route
      }
    }
  }
})

function importFromSimBrief() {
  router.push({
    path: '/charts',
    query: {
      destination: flightPlan.value?.destination,
      origin: flightPlan.value?.origin,
      alternate: flightPlan.value?.alternate
    },
    params: {
      route: flightPlan.value?.route
    }
  })
}
const props = defineProps({
  controlBoolean: Boolean
})
</script>

<template>
  <FullscreenModal controlBoolean="props.controlBoolean">
    <div class="p-10 bg-space-blue rounded-lg">
      <div class="space-y-3">
        <h1 class="text-2xl font-title">Import from SimBrief.</h1>
        <div class="flex flex-col">
          <span class="text-xl font-medium">Please input your SimBrief Username</span>
          <span class="text-sm font-light"
            >To get your SimBrief Username, you can go to your
            <a href="https://www.simbrief.com/system/profile.php" class="dotted-link"
              >SimBrief Account Settings</a
            >
            and fetch your alias.
          </span>
        </div>
        <label class="form-element md:w-1/2">
          <input type="text" v-model="simBriefID" name="airport" placeholder="SimBrief Username" />
        </label>
        <div class="prose text-xs text-inherit font-thin">
          SimBrief is a trademark of Navigraph. Navigraph does not endorse or is otherwise related
          with this service.
        </div>
      </div>
      <div v-if="simBriefID.length <= 32 && simBriefID.length >= 6" class="space-y-4">
        <div class="center p-2 mt-10 bg-oxford-blue rounded-lg">
          <span v-if="!flightPlan"><i class="gg-spinner-alt"></i></span>
          <div v-else>
            <div v-if="flightPlan" class="space-y-4">
              <div class="flex flex-row gap-8">
                <div class="flex flex-col">
                  <span class="font-title">Flt. Number</span>
                  <span class="font-light">{{ flightPlan.flight_number }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-title">Origin</span>
                  <span class="font-light">{{ flightPlan.origin }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="font-title">Departure</span>
                  <span class="font-light">{{ flightPlan.destination }}</span>
                </div>
                <div v-if="flightPlan.alternate" class="flex flex-col">
                  <span class="font-title">Alternate</span>
                  <span class="font-light">{{ flightPlan.alternate }}</span>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="font-title">Route</span>
                <span class="font-light">{{ flightPlan.route }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex flex-row justify-end">
          <button class="primary-button p-2" @click="importFromSimBrief">Import</button>
        </div>
      </div>
    </div>
  </FullscreenModal>
</template>

<style scoped></style>
