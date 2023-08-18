<template>
  <BrandingNavCentered></BrandingNavCentered>
  <section class="w-full h-full">
    <div class="flex md:flex-row flex-col h-3/4">
      <div class="md:w-1/2 center">
        <div>
          <h2 class="font-extralight text-3xl">
            Welcome to <span class="text-columbia-blue">LibreCharts</span>,
          </h2>
          <h1 class="text-5xl font-extralight mt-2">
            Navigate <span class="italic text-light-cyan font-regular">informed</span> anywhere.
          </h1>
          <div class="mt-7">
            <div class="space-y-4">
              <span class="text-columbia-blue text-xl">Where are you flying?</span>
              <div class="flex flex-row gap-2 space-y-2 my-2" @submit="findCharts">
                <label class="form-element md:w-1/2">
                  <input type="text" name="airport" v-model="destination" placeholder="ex. LPPT" />
                </label>
              </div>
              <div class="space-x-2 flex flex-row items-center">
                <button @click="findCharts" class="primary-button md:w-1/4 text-center">
                  Find Charts
                </button>
                <span class="text-sm"
                  >or
                  <span class="dotted-link" @click="modalToggle = !modalToggle"
                    >import from SimBrief</span
                  ></span
                >
                <SimbriefModal v-if="modalToggle" @close="modalToggle = false"></SimbriefModal>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md:w-1/2 vertical-center">
        <div class="center">
          <LandingGlobe></LandingGlobe>
        </div>
        <div id="globeLegend" class="flex flex-row gap-4 center">
          <div class="legend-item">
            <div class="legend-colour bg-columbia-blue"></div>
            AIP Covered
          </div>
          <div class="legend-item">
            <div class="legend-colour bg-light-cyan"></div>
            vACC Covered
          </div>
          <div class="legend-item">
            <div class="legend-colour bg-oxford-blue"></div>
            Not Covered
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="w-full bg-oxford-blue p-10 space-y-10">
    <div class="center space-y-2">
      <h1 class="text-4xl font-title text-center">Flights Covered.</h1>
      <div class="bg-space-blue pill-navigation">
        <div class="selected pill">VATSIM</div>
        <div class="pill">SimToolkitPro</div>
        <div class="pill">POSCON</div>
      </div>
    </div>
    <div class="statistics">
      <div class="statistic">
        <span class="value">64</span>
        <span class="name">Departure & Arrival</span>
      </div>
      <div class="statistic">
        <span class="value">20</span>
        <span class="name">Departure or Arrival</span>
      </div>
      <div class="statistic">
        <span class="value">84</span>
        <span class="name">At least one airport</span>
      </div>
    </div>
  </section>
  <section class="w-full p-10 center space-y-10">
    <h1 class="text-4xl font-title">Why Librecharts?</h1>
    <div class="grid grid-cols-2 gap-7">
      <FeatureIconCard
        name="SimBrief Support"
        icon="gg-inbox"
        description="Import your flight plan directly from SimBrief"
      ></FeatureIconCard>
      <FeatureIconCard
        name="Smart Pinning"
        icon="gg-bookmark"
        description="Librecharts automatically pins the most important charts"
      ></FeatureIconCard>
      <FeatureIconCard
        name="Sleek Interface"
        icon="gg-website"
        description="Modern and fast interface"
      ></FeatureIconCard>
      <FeatureIconCard
        name="Up to date"
        icon="gg-redo"
        description="Our charts auto-update with every new AIRAC revision"
      ></FeatureIconCard>
      <FeatureIconCard
        name="Open-source"
        icon="gg-open-collective"
        description="Community sourced charts and a fully public API"
      ></FeatureIconCard>
      <FeatureIconCard
        name="Superb Coverage"
        icon="gg-globe"
        description="Superior coverage provided by community contributions"
      ></FeatureIconCard>
    </div>
  </section>
  <BrandingFooter
    >Simbrief, VATSIM, POSCON are trademarks of Navigraph, VATSIM Inc and POSCON Inc. respectively.
    None of these companies endorse or are otherwise related with this service.</BrandingFooter
  >
</template>
<script setup lang="ts">
import BrandingFooter from '@/components/footers/BrandingFooter.vue'
import BrandingNavCentered from '@/components/headers/BrandingNavCentered.vue'
import LandingGlobe from '@/components/LandingGlobe.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SimbriefModal from '@/components/SimbriefModal.vue'
import FeatureIconCard from '@/components/FeatureIconCard.vue'

const destination = ref<string>()
const router = useRouter()
const modalToggle = ref<boolean>(false)

function findCharts() {
  router.push({ path: '/charts', query: { destination: destination.value } })
}
</script>
