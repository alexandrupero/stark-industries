import type { IntervalData } from '../types/openvolt/intervalData';
import type { IntensityData } from '../types/nationalgrid/intensityData'
import type { GenerationData } from '../types/nationalgrid/generationData'
import type { EnergyData } from '../types/energyData';

export const useEnergyData = () => {
  const { electricityMeterId, openVoltApiBaseUrl, openVoltApiKey, carbonIntensityApiBaseUrl } = useRuntimeConfig();

  const getEnergyConsumption = async (granularity: string, intervalFrom: string, intervalTo: string): Promise<EnergyData[] | null> => {
    if (granularity !== 'month' && granularity !== 'hh') {
      throw new Error('Invalid granularity');
    }

    const request = await useFetch(() => `${openVoltApiBaseUrl}/interval-data`, {
      key: 'openvolt-interval-data-api-' + granularity,
      query: {
        meter_id: `${electricityMeterId}`,
        granularity: granularity,
        start_date: intervalFrom,
        end_date: intervalTo
      },
      method: 'GET',
      headers: {
        accept: 'application/json',
        "x-api-key": `${openVoltApiKey}`
      },
      transform: (data: IntervalData): EnergyData[] => {
        data.data.splice(-1) // Remove the last element - that seems to always be for the next interval
        return data.data.map((datum) => {
          return {
            value: +datum.consumption,
            unit: datum.consumption_units,
            intervalFrom: new Date(datum.start_interval).toISOString()
          };
        });
      }
    })

    return request?.data?.value;
  };

  const getCarbonEmissions = async (intervalFrom: string, intervalTo: string): Promise<EnergyData[] | null> => {
    // TODO: Validate that max 14 days between the dates

    const request = await useFetch(() => `${carbonIntensityApiBaseUrl}/intensity/${intervalFrom}/${intervalTo}`, {
      key: 'carbon-intensity-api-' + intervalFrom + "-" + intervalTo,
      method: 'GET',
      headers: {
        accept: 'application/json'
      },
      transform: (data: IntensityData): EnergyData[] => {
        data.data.shift() // remove the first element - that seems to always be for the previous interval
        return data?.data?.map((datum) => {
          return {
            value: datum.intensity.actual / 1000, // g to kg
            unit: 'kg',
            intervalFrom: new Date(datum.from).toISOString()
          }
        });
      }
    })

    return request?.data?.value;
  }

  const getGenerationMix = async (intervalFrom: string, intervalTo: string): Promise<GenerationData | null> => {
    const request = await useFetch(() => `${carbonIntensityApiBaseUrl}/generation/${intervalFrom}/${intervalTo}`, {
      key: 'carbon-intensity-api-' + intervalFrom + "-" + intervalTo,
      method: 'GET',
      headers: {
        accept: 'application/json'
      },
      transform: (data: GenerationData): GenerationData => {
        data.data.shift() // remove the first element - that seems to always be for the previous interval
        return data;
      }
    })

    return request?.data?.value;
  }

  return { getEnergyConsumption, getCarbonEmissions, getGenerationMix };
};
