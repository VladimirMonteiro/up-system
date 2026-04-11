import { useCallback, useEffect, useState } from 'react';
import { toolService } from '../services/toolsManager';

const ROWS_PER_PAGE = 12;

export function useToolsManager() {
  /* =========================
     ESTADOS
  ========================== */

  const [tools, setTools] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  // filtros
  const [name, setName] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // feedback
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { searchTool, create, update, remove } = toolService;

  /* =========================
     FETCH
  ========================== */

  const fetchTools = useCallback(
    async (pageNumber = 0) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: pageNumber,
          size: ROWS_PER_PAGE,
        };

        if (name.trim()) {
          params.name = name.trim();
        }

        if (category !== 'all') {
          params.category = category;
        }

        if (status !== 'all') {
          params.status = status;
        }

        const response = await searchTool(params);

        setTools(response.data.content);
        setTotalPages(response.data.totalPages);
        setPage(pageNumber);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar ferramentas');
      } finally {
        setLoading(false);
      }
    },
    [name, category, status],
  );

  /* =========================
     CRUD
  ========================== */

  const createTool = async (tool) => {
    try {
      setError(null);
      await create(tool);
      setSuccess('Ferramenta criada com sucesso');
      fetchTools(0);
      return true;
    } catch (err) {
      setError(err.response?.data?.errors || 'Erro ao criar ferramenta');
      return false;
    }
  };

  const updateTool = async (id, tool) => {
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

  const deleteTool = async (id) => {
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

  /* =========================
     EFFECTS
  ========================== */

  useEffect(() => {
    fetchTools(0);
  }, [fetchTools]);

  /* =========================
     API DO HOOK
  ========================== */

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
