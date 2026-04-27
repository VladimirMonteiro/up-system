type RevenueByMonth = {
  year: number;
  month: number;
  value: number;
};

export type Category = {
  name: CategoryType;
  quantity: number;
};

export type RentItem = {
  id: number;
  name: string;
  quantity: number;
};

export type RecentRent = {
  id: number;
  clientName: string;
  items: RentItem[];
  price: number;
  stateRent: RentDeliveryStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

export type DashboardHomeResponse = {
  totalClients: number;
  availableTools: number;
  rentedTools: number;
  monthlyRevenue: number;

  revenueByMonth: RevenueByMonth[];
  categories: Category[];
  recentRents: RecentRent[];
};

export type RentDeliveryStatus = 'Pendente' | 'Entregue';

export type PaymentStatus = 'Pago' | 'Parc pago' | 'Não pago';

export type CategoryType =
  | 'SCAFFOLDING'
  | 'ELEVATION'
  | 'COMPACTION'
  | 'CONCRETING'
  | 'GARDENING'
  | 'CLEANING'
  | 'ELECTRIC'
  | 'HURRICANE_DEMOLITION'
  | 'GENERATOR'
  | 'VIBRATOR'
  | 'PUMP'
  | 'COMPRESSOR'
  | 'OTHERS';
