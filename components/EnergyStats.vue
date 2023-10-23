<template>
  <div class="stats shadow">
    <div class="stat h-36">
      <div class="stat-figure text-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="m11.5 20l4.86-9.73H13V4l-5 9.73h3.5V20M12 2c2.75 0 5.1 1 7.05 2.95C21 6.9 22 9.25 22 12s-1 5.1-2.95 7.05C17.1 21 14.75 22 12 22s-5.1-1-7.05-2.95C3 17.1 2 14.75 2 12s1-5.1 2.95-7.05C6.9 3 9.25 2 12 2Z"
        /></svg>
      </div>
      <div class="stat-title">
        Monthly Energy Consumed
      </div>
      <div class="stat-value">
        {{ monthlyEnergyData?.value ?? "Unknown" }} {{ monthlyEnergyData?.unit }}
      </div>
      <div class="stat-desc">
        January 2023
      </div>
    </div>

    <div class="stat h-36">
      <div class="stat-figure text-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M11 15q-.425 0-.713-.288T10 14v-4q0-.425.288-.713T11 9h3q.425 0 .713.288T15 10v4q0 .425-.288.713T14 15h-3Zm.5-1.5h2v-3h-2v3Zm5.5 3.75V15.5q0-.425.288-.713T18 14.5h2v-1h-2.275q-.3 0-.513-.213T17 12.75q0-.3.213-.525T17.75 12h2.75q.425 0 .713.288T21.5 13v1.5q0 .425-.288.713t-.712.287h-2v1h2.25q.3 0 .525.225t.225.525q0 .325-.225.537T20.75 18h-3q-.325 0-.537-.213T17 17.25ZM4 15q-.425 0-.713-.288T3 14v-4q0-.425.288-.713T4 9h3q.425 0 .713.288T8 10v.525q0 .3-.225.513t-.525.212q-.325 0-.537-.213T6.5 10.5h-2v3h2q0-.3.213-.525t.537-.225q.3 0 .525.225T8 13.5v.5q0 .425-.288.713T7 15H4Z"
        /></svg>
      </div>
      <div class="stat-title">
        Emissions
      </div>
      <div class="stat-value">
        {{ monthlyCarbonEmissions?.value?.toFixed(3) ?? "Unknown" }} {{ monthlyCarbonEmissions?.unit }}
      </div>
      <div class="stat-desc">
        January 2023
      </div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
        ><path
          fill="currentColor"
          d="M9 13.05C9 14.68 10.34 16 12 16s3-1.32 3-2.95c0-1.31-.53-1.69-3-4.55c-2.5 2.88-3 3.25-3 4.55M20 13c.55 0 1-.45 1-1s-.45-1-1-1h-1V5h1c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1h1v6H4c-.55 0-1 .45-1 1s.45 1 1 1h1v6H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1h-1v-6h1m-3 6H7v-6c.55 0 1-.45 1-1s-.45-1-1-1V5h10v6c-.55 0-1 .45-1 1s.45 1 1 1v6Z"
        /></svg>
      </div>
      <div class="stat-title">
        Fuel Mix
      </div>
      <div class="stat-value">
        <div>
          <div
            v-for="[fuel, perc] in generationMixMap"
            :key="fuel"
          >
            <span class="text-primary">{{ fuel }}</span> {{ perc.toFixed(2) }}%
          </div>
        </div>
      </div>
      <div class="stat-desc">
        January 2023
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EnergyData } from "../types/energyData"
const { getEnergyConsumption, getCarbonEmissions, getGenerationMix } = useEnergyData()

const monthlyEnergyConsumption = await getEnergyConsumption('month', '2023-01-01', '2023-02-01')
const halfHourlyEnergyConsumption = await getEnergyConsumption('hh', '2023-01-01', '2023-02-01')

// TODO: Refactor - possible move this logic to a store/service

// Monthly Energy Data ------------------------------------------------

const monthlyEnergyData = monthlyEnergyConsumption != null ? monthlyEnergyConsumption[0] : null // Only get the first full month returned

// Monthly Carbon Emissions -------------------------------------------

const monthlyCarbonEmissions: EnergyData = {
  unit: 'kg',
  value: 0,
  intervalFrom: '2023-01-01T00:00Z',
}
if (halfHourlyEnergyConsumption != null) {
  const energyConsumptionMap: Map<string, number> = new Map()
  for (const energyData of halfHourlyEnergyConsumption ?? []) {
    energyConsumptionMap.set(energyData.intervalFrom, energyData.value)
  }

  const allCarbonEmissionsData: EnergyData[] = []
  const carbonEmissionIntervals: [string, string][] = [
    ["2023-01-01T00:00Z", "2023-01-14T00:00Z"],
    ["2023-01-14T00:00Z", "2023-01-27T00:00Z"],
    ["2023-01-27T00:00Z", "2023-02-01T00:00Z"]
  ]

  for (const interval of carbonEmissionIntervals) {
    const carbonEmissions = await getCarbonEmissions(interval[0], interval[1])
    if (carbonEmissions !== null) {
      allCarbonEmissionsData.push(...carbonEmissions)
    }
  }

  for (const carbonEmission of allCarbonEmissionsData) {
    const energyConsumption = energyConsumptionMap.get(carbonEmission.intervalFrom)
    if (energyConsumption === undefined) {
      console.log("No energy consumption found for interval: " + carbonEmission.intervalFrom)
      continue
    }
    monthlyCarbonEmissions.value += (carbonEmission.value * energyConsumption)
  }
}

// Monthly Fuel Mix --------------------------------------------------
const generationMixData = await getGenerationMix('2023-01-01', '2023-02-01')
const generationMixMap: Map<string, number> = new Map()
for (const generationMix of generationMixData?.data ?? []) {
  for (const fuelMix of generationMix.generationmix) {
    if (generationMixMap.get(fuelMix.fuel) === undefined) {
      generationMixMap.set(fuelMix.fuel, fuelMix.perc * 1/generationMixData!.data.length)
    } else {
      generationMixMap.set(fuelMix.fuel, generationMixMap.get(fuelMix.fuel)! + fuelMix.perc * 1/generationMixData!.data.length)
      // Looks like other is always 0, but we're missing like 11% of the data - that must be the value for other?
    }
  }
}

</script>
