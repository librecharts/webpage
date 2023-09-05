import { useFetch } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import { computed, unref } from 'vue'

const base_url: String = import.meta.env.VITE_API_URL
const cache_url: String = import.meta.env.VITE_PROXY_URL

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
  const { isFetching, error, data } = await useFetch(currentURL, {
    refetch: true
  })
  return computed(() => (error.value ? error.value : JSON.parse(data.value)))
}

export async function getICAOCodes(): Promise<ComputedRef<Array<string>>> {
  const { isFetching, error, data } = await useFetch(base_url + '/codes')
  return computed(() => (error.value ? error.value : JSON.parse(data.value)))
}

export function getChartFromCache(url: string): string {
  /**
   * Returns a chart's URL in the proxy
   * @param url An array containing ICAO codes
   *
   */
  console.log(url)
  return cache_url + '/chart/' + url
}
