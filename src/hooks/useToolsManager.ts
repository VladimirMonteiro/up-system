import { useCallback, useEffect, useState } from 'react';
import { create, remove, searchTool, update } from '../services/toolService';
import {
  CreateToolRequest,
  SearchParamsProps,
  ToolCategory,
  ToolFilterStatus,
  ToolResponse,
  UpdateToolRequest,
} from '../services/toolService/types';
import { AxiosError } from 'axios';

const ROWS_PER_PAGE = 12;

export function useToolsManager() {
  const [tools, setTools] = useState<ToolResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');
  const [status, setStatus] = useState<ToolFilterStatus | 'all'>('all');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | string[] | null>(null);

  const fetchTools = useCallback(
    async (pageNumber = 0) => {
      try {
        setLoading(true);
        setError(null);

        const params: SearchParamsProps = {
          page: pageNumber,
          size: ROWS_PER_PAGE,
          ...(name.trim() && { name: name.trim() }),
          ...(category !== 'all' && { category }),
          ...(status !== 'all' && { status }),
        };

        const response = await searchTool(params);

        setTools(response.content);
        setTotalPages(response.totalPages);
        setPage(pageNumber);
      } catch (err) {
        const error = err as AxiosError<any>;
        setError(error.response?.data?.message || 'Erro ao carregar ferramentas');
      } finally {
        setLoading(false);
      }
    },
    [name, category, status],
  );

  const createTool = async (data: CreateToolRequest) => {
    try {
      setError(null);
      await create(data);
      setSuccess('Ferramenta criada com sucesso');
      fetchTools(0);
      return true;
    } catch (err) {
      setError(err.response?.data?.errors || 'Erro ao criar ferramenta');
      return false;
    }
  };

  const updateTool = async (id: number, tool: UpdateToolRequest) => {
    try {
      setError(null);
      await update(id, tool);
      setSuccess('Ferramenta atualizada com sucesso');
      fetchTools(page);
      return true;
    } catch (err) {
      setError(err.response?.data?.errors || 'Erro ao atualizar ferramenta');
      return false;
    }
  };

  const deleteTool = async (id: number) => {
    try {
      setError(null);
      await remove(id);
      setSuccess('Ferramenta removida com sucesso');
      fetchTools(page);
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Não é possível remover a ferramenta. Existe um aluguel vinculado.';
      setError(msg);
      throw err;
    }
  };

  useEffect(() => {
    fetchTools(0);
  }, [fetchTools]);

  return {
    // dados
    tools,
    page,
    totalPages,
    totalItems: totalPages * ROWS_PER_PAGE,

    // filtros
    name,
    category,
    status,

    // estados
    loading,
    error,
    success,

    // setters
    setName,
    setCategory,
    setStatus,
    setPage,
    setSuccess,
    setError,

    // ações
    fetchTools,
    createTool,
    updateTool,
    deleteTool,
  };
}
