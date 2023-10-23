export interface IntervalData {
  startInterval: string;
  endInterval:   string;
  granularity:   string;
  data:          Datum[];
}

export interface Datum {
  start_interval:    string;
  meter_id:          string;
  meter_number:      string;
  customer_id:       string;
  consumption:       string;
  consumption_units: string;
}
