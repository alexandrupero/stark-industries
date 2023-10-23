export interface IntensityData {
  data: Datum[];
}

export interface Datum {
  from: string;
  to: string;
  intensity: Intensity;
}

export interface Intensity {
  forecast: number;
  actual: number;
  index: string;
}
