<script setup lang="ts">
import FullscreenModal from '@/components/FullscreenModal.vue'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { debouncedRef, useFetch } from '@vueuse/core'

const simBriefID = ref('')
const url = ref('')
const deBouncedurl = debouncedRef(url, 1000)
const router = useRouter()

async function importFromSimBrief() {
  url.value = `https://www.simbrief.com/api/xml.fetcher.php?username=${simBriefID.value}&json=1`
  const { data } = await useFetch(url)
  const json = JSON.parse(data.value)
  let flightPlan = {
    flight_number: json.general.icao_airline + json.general.flight_number,
    origin: json.origin.icao_code,
    destination: json.destination.icao_code,
    alternate: json.alternate.icao_code,
    route: json.general.route
  }
  console.log(flightPlan)
  await router.push({
    path: '/charts',
    query: {
      destination: flightPlan.destination,
      origin: flightPlan.origin,
      alternate: flightPlan.alternate
    },
    params: {
      route: flightPlan.route
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
            <a
              href="https://www.simbrief.com/system/profile.php"
              class="dotted-link"
              target="_blank"
              >SimBrief Account Settings</a
            >
            and fetch your alias.
          </span>
        </div>
        <label class="form-element md:w-1/2">
          <input type="text" v-model="simBriefID" name="airport" placeholder="SimBrief Username" />
        </label>
        <div class="w-full flex flex-row mt-2">
          <button
            class="primary-button p-2"
            @click="
              async () => {
                await importFromSimBrief()
              }
            "
          >
            Import
          </button>
        </div>
        <div class="prose text-xs text-inherit font-thin">
          SimBrief is a trademark of Navigraph. Navigraph does not endorse or is otherwise related
          with this service.
        </div>
      </div>
    </div>
  </FullscreenModal>
</template>

<style scoped></style>
