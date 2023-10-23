export interface GenerationData {
  data: Datum[];
}

export interface Datum {
  from: string;
  to: string;
  generationmix: GenerationMix[];
}

export interface GenerationMix {
  fuel: string;
  perc: number;
}
