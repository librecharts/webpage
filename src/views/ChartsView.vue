<template>
  <section class="w-screen h-screen flex flex-row">
    <div class="bg-oxford-blue flex flex-col h-full flex-grow">
      <div class="bg-space-blue center">
        <RouterLink to="/" class="darken-hover"
          ><LogoSvg class="nav-logo-long"></LogoSvg
        ></RouterLink>
      </div>
      <div class="p-4 space-y-10 max-h-full flex-grow">
        <div class="horizontal-center">
          <div class="flex flex-col items-end">
            <div class="flex flex-row gap-3 items-center font-title">
              <label>
                <input type="text" class="airport-input" v-model="origin" placeholder="ORIG" />
              </label>
              <div>
                <i class="gg-arrow-long-right"></i>
              </div>
              <label>
                <input type="text" class="airport-input" v-model="destination" placeholder="DEST" />
              </label>
            </div>
            <div v-if="alternate" class="flex flex-row gap-3 items-center font-title">
              <div class="w-6">
                <i class="gg-corner-down-right"></i>
              </div>
              <label>
                <input type="text" class="airport-input" v-model="alternate" placeholder="ALTN" />
              </label>
            </div>
          </div>
        </div>
        <ChartsSelector v-if="airports.length > 0" :airports="airports"></ChartsSelector>
        <div v-else class="mx-1 bg-space-blue text-center w-80 center">
          <span class="m-12 font-light">No Airports Selected</span>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col">
      <object
        class="w-full h-full"
        data="{{ url_for('static', path='charts/LP_AD_2_LPPT_01-1_en.pdf') }}"
        type="application/pdf"
      ></object>
      <footer class="flex flex-row bg-oxford-blue w-full justify-between">
        <div class="p-2 px-4 bg-space-blue flex flex-row items-center gap-4">
          <LogoSvg class="w-4 h-4 rounded-sm" />
          <div class="flex flex-row gap-1">
            <span class="font-thin">Contributed by</span>
            <span>MM-coder</span>
          </div>
        </div>
        <div class="p-2 center horizontal-center">
          <span
            >All charts displayed herein are <strong>for simulation use only</strong> and
            <strong>should not be used for real navigation</strong>.</span
          >
        </div>
        <div class="p-2 px-4 bg-space-blue flex flex-row items-center gap-4">
          <div>
            <span class="font-thin">Source</span>
            <a href="">Portugal vACC</a>
          </div>
        </div>
      </footer>
    </div>
  </section>
</template>
<script setup lang="ts">
import LogoSvg from '@/components/img/LogoSvg.vue'
import ChartsSelector from '@/components/ChartsSelector.vue'
import { computed } from 'vue'
import { useRouteParams, useRouteQuery } from '@vueuse/router'

let route = useRouteParams('route', null)
let origin = useRouteQuery('origin', null)
let destination = useRouteQuery('destination', null)
let alternate = useRouteQuery('alternate', null)

const airports = computed(() => {
  return [origin, destination, alternate]
    .map((r) => r.value)
    .filter((value) => value != null && value !== '')
})
</script>
