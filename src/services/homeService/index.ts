import { homeRoutes } from '../../routes/homeRoutes';
import { DashboardHomeResponse } from './types';

export const getDashboardData = async (): Promise<DashboardHomeResponse> => {
  const response = await homeRoutes.getDashboardData();
  return response.data;
};
