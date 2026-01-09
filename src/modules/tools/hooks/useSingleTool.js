import { useEffect, useState } from 'react'
import api from '../../../utils/api'
import { singleToolService } from '../services/singleToolService';

export const useSingleTool = (id) => {
  const [tool, setTool] = useState(null)
  const [rents, setRents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { findById, findByRentId } = singleToolService;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [rentsResponse, toolResponse] = await Promise.all([
          findByRentId(id),
          findById(id)
        ])

        setRents(rentsResponse.data ?? [])
        setTool(toolResponse.data ?? null)

      } catch (err) {
        console.error(err)
        setError('Erro ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  console.log('Rents:', rents);
  

  return { tool, rents, loading, error }
}
