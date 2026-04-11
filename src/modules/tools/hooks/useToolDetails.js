import { useEffect, useState } from 'react';
import { singleToolService } from '../services/toolDetails';

export const useToolDetails = (id) => {
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { findById } = singleToolService;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const toolResponse = await findById(id);
        setTool(toolResponse.data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { tool, loading, error };
};
