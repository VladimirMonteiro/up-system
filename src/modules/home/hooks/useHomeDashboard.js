import { useEffect, useState } from 'react';
import { homeService } from '../services/homeService';

export function useHomeDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  const { getDashboardData } = homeService;

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardData();
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
  };
}
