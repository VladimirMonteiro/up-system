import { PaymentStatus } from '../paymentService/types';
import { RentDeliveryStatus } from '../rentService/types';
import { PagedResponse } from '../utils/types';

export type BaseToolRequest = {
  name: string;
  totalQuantity: number;
  quantityMaintenance: number;
  daily: number;
  week: number;
  biweekly: number;
  twentyOneDays: number;
  priceMonth: number;
  category: ToolCategory;
};

export type ToolRentDetails = {
  id: number;
  clientName: string;
  initialDate: string;
  deliveryDate: string;
  price: number;
  QuantityToolInRent: number;
  paymentStatus: PaymentStatus;
  stateRent: RentDeliveryStatus;
};

export type CreateToolRequest = BaseToolRequest;

export type UpdateToolRequest = Partial<BaseToolRequest>;

export type ToolResponse = BaseToolRequest & {
  id: number;
  quantityAvailable: number;
  status: ToolFilterStatus;
};

export type ToolDetailsResponse = ToolResponse & {
  quantityRentActive: number;
  quantityTotalRent: number;
  totalRevenue: number;
  rents: ToolRentDetails[];
};

export type ToolListResponse = PagedResponse<ToolResponse>;

export type ParamsProps = {
  page: number;
  size: number;
};

export type SearchParamsProps = ParamsProps & {
  name?: string;
  category?: ToolCategory;
  status?: ToolFilterStatus;
};

export type ToolFilterStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'RENTED' | 'MAINTENANCE';

export type ToolCategory =
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
