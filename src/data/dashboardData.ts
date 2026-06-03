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

// Dynamic Graph Data Generators
// Daily: 96 points (every 15 min), max 7 days back.
export const generateDailyData = (daysAgo: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const baseTraffic = Math.max(100, 800 - (daysAgo * 100)); // traffic goes down the further back we go
  
  for (let i = 0; i < 96; i++) {
    const hours = Math.floor(i / 4);
    const mins = (i % 4) * 15;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    // Add explicitly marked ticks for the XAxis, other ticks are empty string
    const isTick = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:45'].includes(timeStr);
    const tickLabel = isTick ? (timeStr === '23:45' ? '23:59' : timeStr) : '';
    
    // Create organic looking curve
    const timeMultiplier = Math.sin((i / 96) * Math.PI) * 2 + 0.5;
    const noise = Math.random() * 0.4 + 0.8; 
    
    data.push({
      name: tickLabel,           // Clean visible label for XAxis
      timestamp: timeStr,        // For Tooltip
      clicks: Math.floor(baseTraffic * 0.3 * timeMultiplier * noise),
      traffic: Math.floor(baseTraffic * timeMultiplier * noise),
    });
  }
  return data;
};

// Weekly: 28 points (every 6 hours for 7 days)
export const generateWeeklyData = (weeksAgo: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseTraffic = Math.max(3000, 15000 - (weeksAgo * 1500));
  
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 4; h++) {
      const timeStr = `${(h * 6).toString().padStart(2, '0')}:00`;
      
      const timeMultiplier = Math.sin((h / 4) * Math.PI) * 1.5 + 0.5;
      const dayMultiplier = (d === 5 || d === 6) ? 1.5 : 1.0; // Weekend bump
      const noise = Math.random() * 0.3 + 0.85;
      
      data.push({
        name: h === 0 ? days[d] : '',
        timestamp: `${days[d]}, ${timeStr}`,
        clicks: Math.floor(baseTraffic * 0.3 * timeMultiplier * dayMultiplier * noise),
        traffic: Math.floor(baseTraffic * timeMultiplier * dayMultiplier * noise),
      });
    }
  }
  return data;
};

// Monthly: 28 days (4 weeks) or 35 days (5 weeks) depending on offset
export const generateMonthlyData = (monthsAgo: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const daysInMonth = monthsAgo % 2 === 0 ? 28 : 35; // alternate 4/5 weeks
  const baseTraffic = Math.max(10000, 85000 - (monthsAgo * 5000));
  
  for (let d = 1; d <= daysInMonth; d++) {
    const isWeekStart = d % 7 === 1;
    const weekNum = Math.ceil(d / 7);
    
    const timeMultiplier = Math.sin((d / daysInMonth) * Math.PI) * 1.2 + 0.8;
    const noise = Math.random() * 0.4 + 0.8;
    
    // Example: "June 14" (dummy month, just using "Day X")
    data.push({
      name: isWeekStart ? `Week ${weekNum}` : '',
      timestamp: `Day ${d}`,
      clicks: Math.floor(baseTraffic * 0.3 * timeMultiplier * noise),
      traffic: Math.floor(baseTraffic * timeMultiplier * noise),
    });
  }
  return data;
};

// Yearly: 12 months
export const generateYearlyData = (yearsAgo: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = 2026 - yearsAgo;
  const baseTraffic = yearsAgo === 0 ? 400000 : 250000; // Previous year has less traffic
  
  for (let m = 0; m < 12; m++) {
    const timeMultiplier = (m > 3 && m < 8) ? 1.4 : 0.9; // Summer bump
    const noise = Math.random() * 0.3 + 0.85;
    
    data.push({
      name: months[m],
      timestamp: `${months[m]} ${year}`,
      clicks: Math.floor(baseTraffic * 0.3 * timeMultiplier * noise),
      traffic: Math.floor(baseTraffic * timeMultiplier * noise),
    });
  }
  return data;
};
