import { useFetch } from '@vueuse/core'

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

export async function getCategorizedChartsByICAOCode(icao_code: string) {
  const { isFetching, error, data } = await useFetch(
    base_url + '/charts/' + icao_code + '/categorized'
  )
  if (!isFetching.value) {
    if (error.value !== null) {
      return JSON.parse(error.value)
    } else {
      if (data.value !== null) {
        return JSON.parse(data.value)
      }
    }
  }
}
