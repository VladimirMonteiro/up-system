import { toolRoutes } from '../../routes/toolRoutes';
import {
  CreateToolRequest,
  ParamsProps,
  SearchParamsProps,
  ToolDetailsResponse,
  ToolListResponse,
  ToolResponse,
  UpdateToolRequest,
} from './types';

export const findAll = async (params: ParamsProps): Promise<ToolListResponse> => {
  const response = await toolRoutes.findAll(params);
  return response.data;
};

export const searchTool = async (params: SearchParamsProps): Promise<ToolListResponse> => {
  const response = await toolRoutes.searchTool(params);
  return response.data;
};

export const findById = async (id: number): Promise<ToolDetailsResponse> => {
  const response = await toolRoutes.findById(id);
  return response.data;
};

export const create = async (data: CreateToolRequest): Promise<ToolResponse> => {
  const response = await toolRoutes.create(data);
  return response.data;
};

export const update = async (id: number, data: UpdateToolRequest): Promise<ToolResponse> => {
  const response = await toolRoutes.update(id, data);
  return response.data;
};

export const remove = async (id: number): Promise<void> => {
  await toolRoutes.remove(id);
};
