import { useFetch } from '@vueuse/core'
import type { Ref } from 'vue'
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

export async function getCategorizedChartsByICAOCode(icao_code: Ref<String>) {
  const { isFetching, error, data } = await useFetch(
    base_url + `/charts/${unref(icao_code)}/categorized`,
    {
      refetch: true
    }
  )
  return computed(() => (error.value ? error.value : JSON.parse(data.value)))
}
