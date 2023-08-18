import { useFetch } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import { computed, unref } from 'vue'

const base_url: String = 'http://localhost:8000'

export async function getChartsByICAOCode(icao_code: string) {
  const { isFetching, data, error } = await useFetch(base_url + '/charts/' + icao_code)
  if (!isFetching) {
    if (error.value !== null) {
      return error.value
    } else {
      if (data.value !== null) {
        return data
      }
    }
  }
}

export async function getCategorizedChartsByICAOCode(airport: Ref<String>) {
  const currentURL = computed(() => {
    return base_url + `/charts/${airport.value}/categorized`
  })
  const { isFetching, error, data } = await useFetch(currentURL, {
    refetch: true
  })
  return computed(() => (error.value ? error.value : JSON.parse(data.value)))
}

export async function getCoverageStatistics(provider: Ref<String>) {
  const currentURL = computed(() => {
    return base_url + `/coverage/${provider.value}`
  })
  console.log(currentURL.value)
  const { isFetching, error, data } = await useFetch(currentURL, {
    refetch: true
  })
  return computed(() => (error.value ? error.value : JSON.parse(data.value)))
}

export async function getICAOCodes(): Promise<ComputedRef<Array<string>>> {
  const { isFetching, error, data } = await useFetch(base_url + '/codes')
  return computed(() => (error.value ? error.value : JSON.parse(data.value)))
}
