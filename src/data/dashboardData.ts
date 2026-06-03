import type { DashboardMetric, ChartDataPoint } from '../types';

export const mockDashboardMetrics: DashboardMetric[] = [
  { id: 'm1', label: 'Daily Clicks', value: '12.4K', change: '+12%', isPositive: true },
  { id: 'm2', label: 'Views', value: '41.5K', change: '+5%', isPositive: true },
  { id: 'm3', label: 'Reading Time', value: '10 min avg', change: '-1%', isPositive: false },
  { id: 'm4', label: 'Number of Shares', value: '2.1K', change: '+18%', isPositive: true },
];

export const mockPieChartData: ChartDataPoint[] = [
  { name: 'Technology', value: 480 },
  { name: 'Programming', value: 310 },
  { name: 'Artificial Intelligence', value: 540 },
  { name: 'Career & Growth', value: 210 },
  { name: 'Startups', value: 290 },
  { name: 'Thoughts & Opinions', value: 175 },
  { name: 'News & Updates', value: 390 },
  { name: 'Tutorials', value: 430 },
  { name: 'Open Source', value: 220 },
  { name: 'Other', value: 145 },
];

export const mockLineChartDataDaily: ChartDataPoint[] = [
  { name: '00:00', clicks: 120, traffic: 400, readingTime: 5 },
  { name: '04:00', clicks: 80, traffic: 300, readingTime: 4 },
  { name: '08:00', clicks: 250, traffic: 800, readingTime: 8 },
  { name: '12:00', clicks: 450, traffic: 1200, readingTime: 12 },
  { name: '16:00', clicks: 380, traffic: 1000, readingTime: 10 },
  { name: '20:00', clicks: 520, traffic: 1400, readingTime: 14 },
  { name: '23:59', clicks: 300, traffic: 900, readingTime: 9 },
];

export const mockLineChartDataWeekly: ChartDataPoint[] = [
  { name: 'Mon', clicks: 4000, traffic: 12000, readingTime: 10 },
  { name: 'Tue', clicks: 3000, traffic: 10000, readingTime: 9 },
  { name: 'Wed', clicks: 5000, traffic: 14000, readingTime: 11 },
  { name: 'Thu', clicks: 4500, traffic: 13000, readingTime: 10 },
  { name: 'Fri', clicks: 6000, traffic: 16000, readingTime: 12 },
  { name: 'Sat', clicks: 8000, traffic: 22000, readingTime: 15 },
  { name: 'Sun', clicks: 7500, traffic: 20000, readingTime: 14 },
];

export const mockLineChartDataMonthly: ChartDataPoint[] = [
  { name: 'Week 1', clicks: 24000, traffic: 80000, readingTime: 10 },
  { name: 'Week 2', clicks: 30000, traffic: 95000, readingTime: 11 },
  { name: 'Week 3', clicks: 28000, traffic: 90000, readingTime: 10 },
  { name: 'Week 4', clicks: 35000, traffic: 110000, readingTime: 12 },
];

export const mockLineChartDataYearly: ChartDataPoint[] = [
  { name: 'Jan', clicks: 95000, traffic: 310000, readingTime: 10 },
  { name: 'Feb', clicks: 88000, traffic: 280000, readingTime: 10 },
  { name: 'Mar', clicks: 112000, traffic: 360000, readingTime: 11 },
  { name: 'Apr', clicks: 98000, traffic: 325000, readingTime: 11 },
  { name: 'May', clicks: 130000, traffic: 420000, readingTime: 12 },
  { name: 'Jun', clicks: 145000, traffic: 480000, readingTime: 13 },
  { name: 'Jul', clicks: 138000, traffic: 455000, readingTime: 12 },
  { name: 'Aug', clicks: 152000, traffic: 500000, readingTime: 13 },
  { name: 'Sep', clicks: 125000, traffic: 410000, readingTime: 12 },
  { name: 'Oct', clicks: 140000, traffic: 460000, readingTime: 13 },
  { name: 'Nov', clicks: 160000, traffic: 530000, readingTime: 14 },
  { name: 'Dec', clicks: 178000, traffic: 590000, readingTime: 15 },
];
