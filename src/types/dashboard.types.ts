/* eslint-disable */
export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change: string; // e.g., "+12%", "-2%"
  isPositive: boolean;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: any; // Allow dynamic keys for multi-line charts
}
