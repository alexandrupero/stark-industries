// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    electricityMeterId: process.env.ELECTRICITY_METER_ID,
    openVoltApiBaseUrl: process.env.OPEN_VOLT_API_BASE_URL,
    openVoltApiKey: process.env.OPEN_VOLT_API_KEY,
    carbonIntensityApiBaseUrl: process.env.CARBON_INTENSITY_API_BASE_URL
  }
})
