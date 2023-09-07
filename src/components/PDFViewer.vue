<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { usePDF, VuePDF } from '@tato30/vue-pdf'
import { useToNumber } from '@vueuse/core'
import { getChartFromCache } from '@/api'

const props = defineProps({
  chart: {
    type: Object,
    required: true
  }
})

const scale = ref<number>(1)
const pageInput = ref<number>(1)
const rotation = ref<number>(1)
const chart = toRef(props, 'chart')
let pdfContent = ref()
let totalPages = ref<number>()
const loaded = ref(false)
const canvasContainer = ref(null)
const isDarkMode = ref<boolean>(false)

function loadCurrentChart() {
  if (pdfContent.value) {
    pdfContent.value.destroy()
  }
  pageInput.value = 1
  loaded.value = false
  const { pdf, pages } = usePDF(getChartFromCache(chart.value.source.url))
  pdfContent = pdf
  totalPages = pages
}
loadCurrentChart() // This will load on component init

watch(chart, () => {
  loadCurrentChart()
})

function onLoaded() {
  loaded.value = true
}

const computedScale = computed(() => {
  return useToNumber(scale).value
})

const page = computed(() => {
  return pageInput.value <= totalPages.value ? pageInput.value : totalPages.value
})

onBeforeUnmount(() => {
  pdfContent.value.destroy()
})
</script>

<template>
  <div v-show="loaded" class="w-full center z-50">
    <div class="bg-oxford-blue rounded-lg p-2 absolute top-0 mt-4 w-96 center">
      <div class="flex flex-row gap-4">
        <i
          class="text-columbia-blue darken-hover"
          @click="isDarkMode = !isDarkMode"
          :class="isDarkMode ? 'gg-sun' : 'gg-moon'"
        ></i>
        <div class="flex flex-row gap-2 text-columbia-blue">
          <i
            class="gg-chevron-up-o"
            :class="pageInput + 1 <= totalPages ? 'darken-hover' : 'text-gray-600'"
            @click="pageInput + 1 <= totalPages ? (pageInput += 1) : null"
          ></i>
          <i
            class="gg-chevron-down-o"
            :class="pageInput - 1 >= totalPages ? 'darken-hover' : 'text-gray-600'"
            @click="pageInput - 1 >= totalPages ? (pageInput = pageInput - 1) : null"
          ></i>
        </div>
        <div>
          <input
            type="number"
            v-model="pageInput"
            class="bg-space-blue rounded-lg w-10 text-center"
            :max="totalPages"
          />
          <span class="mx-1 tracking-widest">/ {{ totalPages }}</span>
        </div>
        <div>
          <select v-model="scale" class="bg-space-blue px-2">
            <option value="3">300%</option>
            <option value="2">200%</option>
            <option value="1.5">150%</option>
            <option value="1">100%</option>
            <option value="0.75">75%</option>
            <option value="0.50">50%</option>
          </select>
        </div>
        <div class="flex flex-row gap-2 text-columbia-blue">
          <i @click="rotation = rotation + 90" class="gg-corner-up-left"></i>
          <i @click="rotation = rotation - 90" class="gg-corner-up-right"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="center h-full" v-if="!loaded">
    <i class="gg-spinner-alt" style="--ggs: 3"></i>
  </div>
  <div class="h-full">
    <div class="my-0 mx-auto" :class="isDarkMode ? 'dark-filter' : ''">
      <VuePDF
        ref="canvasContainer"
        @loaded="onLoaded"
        class="h-full w-full"
        :pdf="pdfContent"
        :page="page"
        :scale="computedScale"
        :rotation="rotation"
        fit-parent
      ></VuePDF>
    </div>
  </div>
</template>

<style scoped></style>