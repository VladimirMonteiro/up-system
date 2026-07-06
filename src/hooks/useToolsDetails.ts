import { useEffect, useState } from 'react';
import { findById } from '../services/toolService';
import { ToolDetailsResponse } from '../services/toolService/types';

export const useToolDetails = (id: number) => {
  const [tool, setTool] = useState<ToolDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const toolResponse = await findById(id);
        setTool(toolResponse);
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
