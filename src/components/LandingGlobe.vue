<template>
  <div ref="globeCanvas"></div>
</template>
<script lang="ts">
import Globe from 'globe.gl'
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { get } from '@vueuse/core'

const colors = ['#6EA4BF', '#AACADA', '#0C1E31']
const countryInformation = {
  IRL: 'aip',
  DN1: 'aip',
  MYS: 'aip',
  DZA: 'aip',
  ESP: 'aip',
  BEN: 'aip',
  BFA: 'aip',
  CMR: 'aip',
  CAF: 'aip',
  COD: 'aip',
  CIV: 'aip',
  GAB: 'aip',
  GNQ: 'aip',
  MDG: 'aip',
  MLI: 'aip',
  MRT: 'aip',
  NER: 'aip',
  SEN: 'aip',
  TCD: 'aip',
  TGO: 'aip',
  GNB: 'aip',
  HRV: 'aip',
  US1: 'aip',
  IND: 'aip',
  BIH: 'aip',
  MAR: 'aip',
  SAH: 'aip',
  SWE: 'aip',
  RUS: 'aip',
  KAZ: 'aip',
  NZ1: 'aip',
  ZAF: 'aip',
  SVK: 'aip',
  DEU: 'aip',
  SRB: 'aip',
  MNE: 'aip',
  GB1: 'aip',
  BEL: 'aip',
  LUX: 'aip',
  GRC: 'aip',
  NL1: 'aip',
  AU1: 'aip',
  KOS: 'aip',
  MNG: 'aip',
  ISL: 'aip',
  DOM: 'aip',
  FI1: 'aip',
  PRT: 'aip',
  CHL: 'vacc',
  CHE: 'vacc',
  MOZ: 'vacc',
  BWA: 'vacc',
  NAM: 'vacc'
}

export default {
  setup() {
    const globeCanvas = ref(null)

    onMounted(() => {
      const world = Globe()(globeCanvas.value)
        .backgroundColor('rgba(0,0,0,0)')
        .showGlobe(false)
        .showAtmosphere(false)

      world.controls().autoRotate = true
      world.controls().autoRotateSpeed = 1.8

      function updateDimensions() {
        let globeElement = globeCanvas.value
        let dimensions = Math.min(
          globeElement.parentElement.parentElement.offsetHeight,
          globeElement.parentElement.parentElement.offsetWidth
        )
        world.width(dimensions).height(dimensions)
      }

      updateDimensions()

      function createMaterial(country) {
        function getColour() {
          if (Object.keys(countryInformation).includes(country.properties.SOV_A3)) {
            return countryInformation[country.properties.SOV_A3] == 'aip' ? '#AACADA' : '#6EA4BF'
          } else {
            return '#0C1E31'
          }
        }

        return new THREE.MeshLambertMaterial({
          color: getColour(),
          side: THREE.DoubleSide
        })
      }

      fetch('./datasets/ne_110m_admin_0_countries.geojson')
        .then((res) => res.json())
        .then((countries) => {
          world
            .polygonsData(countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ'))
            .polygonCapMaterial((feat) => createMaterial(feat))
            .polygonSideColor(() => 'rgba(0,0,0,0)')
        })

      window.onresize = function (event) {
        updateDimensions()
      }
    })
    return {
      globeCanvas
    }
  }
}
</script>
