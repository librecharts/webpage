<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { usePDF, VuePDF } from '@tato30/vue-pdf'
import { useToNumber } from '@vueuse/core'
import { getChartFromCache } from '@/api'
import LogoSvg from '@/components/img/LogoSvg.vue'
import FullscreenModal from '@/components/FullscreenModal.vue'

const props = defineProps({
  chart: {
    type: Object,
    required: true
  }
})

const scaleInput = ref<number | string>('auto')
const autoScale = ref<number>(1)
const pageInput = ref<number>(1)
const rotation = ref<number>(1)
const chart = toRef(props, 'chart')
let pdfContent = ref()
let totalPages = ref<number>()
const loaded = ref(false)
const canvasContainer = ref(null)
const isDarkMode = ref<boolean>(false)
const errored = ref<boolean>(false)
const pdfInfo = ref(null)
const reportModal = ref<boolean>(false)
const issueText = ref<string>(null)
const issueURL = ref<string>('https://github.com')

function loadCurrentChart() {
  if (pdfContent.value) {
    pdfContent.value.destroy()
  }
  pageInput.value = rotation.value = 1
  loaded.value = false
  const { pdf, pages } = usePDF(getChartFromCache(chart.value.source.url), {
    onError: (error) => {
      console.error(error)
      errored.value = true
    }
  })
  pdfContent = pdf
  totalPages = pages
}
loadCurrentChart() // This will load on component init

watch(chart, () => {
  loadCurrentChart()
})

function onLoaded(value) {
  // Load the pdfInfo ref when the chart loads
  loaded.value = true
  pdfInfo.value = value
}

function updateAutoRatio() {
  /**
   * Updates the auto ratio based of the chart's information
   */
  if (pdfInfo.value) {
    // Algorithm is just the mean between the quotient the parent height
    // and width and the pdf height and width
    autoScale.value =
      ((canvasContainer.value.offsetHeight - 50) / pdfInfo.value.rawDims.pageHeight +
        (canvasContainer.value.offsetWidth - 50) / pdfInfo.value.rawDims.pageWidth) /
      2
  }
}

watch([canvasContainer, loaded, errored], async () => {
  await nextTick() // Wait for the canvasContainer width and height to be populated
  if (canvasContainer.value && !errored.value && loaded.value) {
    updateAutoRatio()
  }
})

const computedScale = computed(() => {
  if (scaleInput.value != 'auto') {
    let number = useToNumber(scaleInput.value).value // Convert to a number
    return number < 10 ? number : 10 // No value over 10 is reasonable, it will crash browsers
  } else {
    return autoScale.value
  }
})

const page = computed(() => {
  return pageInput.value <= totalPages.value ? pageInput.value : totalPages.value
})

onBeforeUnmount(() => {
  pdfContent.value.destroy()
})
</script>

<template>
  <div v-show="loaded" class="w-full center z-20">
    <div class="bg-oxford-blue rounded-lg p-2 absolute top-0 mt-4 w-96 center">
      <div class="flex flex-row gap-4">
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
          <select v-model="scaleInput" class="bg-space-blue px-2">
            <option value="3">300%</option>
            <option value="2">200%</option>
            <option value="1.5">150%</option>
            <option value="auto">Auto</option>
            <option value="1">100%</option>
            <option value="0.75">75%</option>
            <option value="0.50">50%</option>
            <option
              v-show="!['3', '2', '1.5', 'auto', '1', '0.75', '0.50'].includes(scaleInput)"
              :value="computedScale"
            >
              Custom
            </option>
          </select>
        </div>
        <div class="flex flex-row gap-2 text-columbia-blue">
          <i @click="rotation = rotation + 90" class="gg-corner-up-left darken-hover"></i>
          <i @click="rotation = rotation - 90" class="gg-corner-up-right darken-hover"></i>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loaded" class="p-2 fixed bottom-20 right-0 mr-4 h-96 z-20">
    <div class="flex flex-col gap-4 justify-end h-full">
      <div v-show="scaleInput != 'auto'" class="sidebar-icon" @click="scaleInput = 'auto'">
        <i class="gg-maximize"></i>
      </div>
      <div
        class="sidebar-icon"
        :class="scaleInput >= 10 ? 'disabled' : ''"
        @click="
          () => {
            if (scaleInput != 'auto') {
              if (scaleInput + 0.5 < 10) {
                scaleInput += 0.5
              } else {
                scaleInput = 10
              }
            } else {
              scaleInput = computedScale + 0.5
            }
          }
        "
      >
        <i class="gg-zoom-in"></i>
      </div>
      <div
        class="sidebar-icon"
        :class="scaleInput <= 0.1 ? 'disabled' : ''"
        @click="
          () => {
            if (scaleInput != 'auto') {
              if (scaleInput - 0.5 > 0.1) {
                scaleInput -= 0.5
              } else {
                scaleInput = 0.1
              }
            } else {
              scaleInput = computedScale - 0.5
            }
          }
        "
      >
        <i class="gg-zoom-out"></i>
      </div>
      <div class="sidebar-icon" @click="isDarkMode = !isDarkMode">
        <i class="" :class="isDarkMode ? 'gg-sun' : 'gg-moon'"></i>
      </div>
      <div
        class="sidebar-icon bg-red-300 hover:bg-red-500 hover:text-white"
        @click="reportModal = !reportModal"
      >
        <i class="gg-danger"></i>
      </div>
    </div>
  </div>
  <div class="center h-full w-full text-gray-600 space-y-10" v-if="!loaded && !errored">
    <i class="gg-spinner-alt" style="--ggs: 3"></i>
    <div class="prose uppercase text-gray-600 flex flex-col text-center gap-2">
      <span class="text-md font-medium">Loading Chart.</span>
      <span class="text-xs font-light">
        Taking too long? You can try
        <a class="dotted-link text-columbia-blue" :href="chart.source.url" target="_blank"
          >going direct</a
        >.
      </span>
    </div>
  </div>
  <div class="center h-full w-full" v-if="errored">
    <div class="p-10 bg-oxford-blue rounded-lg center space-y-2 flex flex-col">
      <RouterLink to="/" class="darken-hover"><LogoSvg class="w-16 h-16"></LogoSvg></RouterLink>
      <h1 class="text-2xl uppercase text-red-400">Chart loading failed</h1>
      <span class="text-md">
        You can try
        <a class="dotted-link" :href="chart.source.url" target="_blank">going direct</a>.
      </span>
      <span class="text-xs"
        >If you believe this is an error please open a bug report
        <a class="dotted-link" @click="reportModal = true">here</a>.
      </span>
      <div class="horizontal-center space-y-2 mt-5">
        <div class="flex flex-row gap-x-4 font-light text-gray-300">
          <a class="dotted-link" href="https://github.com/librecharts">Github</a>
          <a class="dotted-link" href="">Discord</a>
          <a class="dotted-link" href="">API</a>
        </div>
        <span class="text-sm uppercase font-light text-gray-500"
          >NAVIGATE. INFORMED. ANYWHERE.</span
        >
      </div>
    </div>
  </div>
  <div ref="canvasContainer" class="h-full overflow-scroll" v-show="!errored && loaded">
    <div
      class="transition-all duration-500 inset-y-4 center relative"
      :class="isDarkMode ? 'dark-filter' : ''"
    >
      <VuePDF
        @loaded="onLoaded"
        :pdf="pdfContent"
        :page="page"
        :scale="computedScale"
        :rotation="rotation"
        :text-layer="false"
        :annotation-layer="false"
      ></VuePDF>
    </div>
  </div>
  <FullscreenModal v-if="reportModal" @close="reportModal = false">
    <div class="p-10 bg-space-blue rounded-lg">
      <div class="space-y-4">
        <div>
          <h1 class="text-2xl font-title">Report a chart error.</h1>
          <h2 class="text-xl font-light">
            Report inaccuracies, an outdated chart or another issue.
          </h2>
          <h3 class="text-lg font-thin">Unfortunately, we only accept reports via our GitHub.</h3>
        </div>
        <form class="space-y-3" target="_blank">
          <label class="form-element">
            <span class="label">Filename</span>
            <input type="text" :value="chart.filename" disabled />
          </label>
          <label class="form-element">
            <span class="label">Airport</span>
            <input type="text" :value="chart.icao_code" disabled />
          </label>
          <label class="form-element">
            <span class="label">Issue</span>
            <input
              type="text"
              v-model="issueText"
              placeholder="Incorrect type, outdated, etc"
              required
              maxlength="124"
            />
            <span v-if="issueText" class="text-xs text-gray-600 font-header"
              >{{ issueText.length }}/124</span
            >
          </label>
        </form>
        <div class="flex flex-col w-1/2 space-y-3">
          <button class="primary-button mt-2" :disabled="issueText == null || issueText == ''">
            <a
              :href="`https://github.com/librecharts/charts/issues/new?labels=chart+issue&title=${encodeURIComponent(
                `bug: Issue with ${chart.filename}`
              )}&body=${encodeURIComponent(
                `Filename: ${chart.filename}\nAirport: ${chart.icao_code}\nIssue Encountered: ${issueText}
    `
              )}`"
              target="_blank"
              >Report on GitHub</a
            >
          </button>
          <span class="footnote uppercase text-gray-600 select-none">(Opens in a new tab) </span>
        </div>
      </div>
    </div>
  </FullscreenModal>
</template>

<style scoped></style>
