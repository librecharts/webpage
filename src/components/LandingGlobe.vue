<template>
  <div ref="globeCanvas"></div>
</template>
<script lang="ts">
import Globe from 'globe.gl'
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

const colors = ['#6EA4BF', '#AACADA', '#0C1E31']

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
        return new THREE.MeshLambertMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
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
