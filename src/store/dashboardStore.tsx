/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardFirstStageResponse } from '../services/dashboard.service';

interface DashboardState {
  data: DashboardFirstStageResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardState | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardFirstStageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const result = await dashboardService.getFirstStage();
      setData(result);
      setError(null);
    } catch (err: unknown) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{ data, isLoading, error, fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardStore() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboardStore must be used within DashboardProvider');
  return context;
}
