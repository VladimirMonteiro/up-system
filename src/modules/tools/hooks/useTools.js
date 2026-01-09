import { useEffect, useState } from 'react';
import { toolService } from '../services/toolService';

const ROWS_PER_PAGE = 13;

export const useTools = () => {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState(null);

  const { findAll, create, update, remove, searchTool } = toolService;

  const fetch = async (pageNumber = 0) => {
    try {
      setLoading(true);

      const response = search.trim()
        ? await searchTool({ name: search, page: pageNumber, size: ROWS_PER_PAGE })
        : await findAll({ page: pageNumber, size: ROWS_PER_PAGE });

      setData(response.data);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createTool = async (tool) => {
    try {
      const response = await create(tool);
      setSuccess('Ferramenta criada com sucesso.');
      fetch(0);
      return true;
    } catch (error) {
      setErrors(error.response?.data?.errors);
      return false;
    }
  };

  const updateTool = async (id, tool) => {
    try {
      const response = await update(id, tool);
      setSuccess('Ferramenta atualizada com sucesso.');
      fetch(page);
      return true;
    } catch (error) {
      setErrors(error.response?.data?.errors);
      return false;
    }
  };

  const deleteTool = async (id) => {
  try {
    await remove(id);
    setSuccess('Ferramenta removida com sucesso.');
    fetch(page);
  } catch (error) {
    setErrors(
      error.response?.data?.message ||
      'Não é possível remover a ferramenta. Existe um aluguel vinculado.'
    );
    throw error; // 👈 ESSENCIAL
  }
};


  useEffect(() => {
    fetch(0);
  }, []);

  return {
    tools: data.content,
    totalPages: data.totalPages,
    page,
    loading,
    search,
    setSearch,
    success,
    setSuccess,
    errors,
    setErrors,
    fetch,
    createTool,
    updateTool,
    deleteTool,
  };
};
