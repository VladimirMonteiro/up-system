import { useEffect, useState } from 'react';
import { DashboardHomeResponse } from '../services/homeService/types';
import { getDashboardData } from '../services/homeService';

export function useHomeDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardHomeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboardData() {
    try {
      const response = await getDashboardData();
      setDashboardData(response);
    } catch (err: unknown) {
      console.error(err);
      setError('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
  };
}
