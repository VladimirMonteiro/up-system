import { MdDelete } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';

import ConfirmDeleteModal from '../../../../components/modalConfirmDelete/ConfirmDeleteModal';
import ComponentMessage from '../../../../components/componentMessage/ComponentMessage';
import Loading from '../../../../components/loading/Loading';
import { formateNumber } from '../../../../utils/formatNumber';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TableTools.module.css';

const TableTools = ({
  tools,
  loading,
  page,
  totalPages,
  onNext,
  onPrevious,
  onEdit,
  onView,
  onDelete,
}) => {
  const { pathname } = useLocation();
  const isToolsRoute = pathname.startsWith('/ferramentas');

  const [openDelete, setOpenDelete] = useState(false);
  const [toolId, setToolId] = useState(null);
  const [toolName, setToolName] = useState('');
 

  if (loading) return <Loading table />;

  const confirmDelete = async () => {
  try {
    await onDelete(toolId);
    setOpenDelete(false);
  } catch {
    setOpenDelete(false);
  }
};


  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Total</th>
            <th>Disponível</th>
            <th>Diária</th>
            <th>Semanal</th>
            <th>Quinzena</th>
            <th>3 semanas</th>
            <th>Mensal</th>
            {isToolsRoute && <th>Ações</th>}
          </tr>
        </thead>

        <tbody>
          {tools.length === 0 ? (
            <tr>
              <td colSpan={10} align='center'>
                Nenhuma ferramenta encontrada
              </td>
            </tr>
          ) : (
            tools.map((tool) => (
              <tr key={tool.id}>
                <td>{tool.id}</td>
                <td>{tool.name}</td>
                <td>{tool.totalQuantity}un</td>
                <td>{tool.quantity}un</td>
                <td>{formateNumber(tool.daily)}</td>
                <td>{formateNumber(tool.week)}</td>
                <td>{formateNumber(tool.biweekly)}</td>
                <td>{formateNumber(tool.twentyOneDays)}</td>
                <td>{formateNumber(tool.priceMonth)}</td>

                {isToolsRoute && (
                  <td>
                    <MdDelete
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => {
                        setToolId(tool.id);
                        setToolName(tool.name);
                        setOpenDelete(true);
                      }}
                    />
                    <GrView
                      style={{ marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => onView(tool.id)}
                    />
                    <FaPen
                      style={{ marginLeft: 8, cursor: 'pointer' }}
                      onClick={() => onEdit(tool)}
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={onPrevious} disabled={page === 0}>
          Anterior
        </button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <button onClick={onNext} disabled={page + 1 >= totalPages}>
          Próxima
        </button>
      </div>

      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        itemName={toolName}
        onConfirm={confirmDelete}
        remove
      />
    </div>
  );
};

export default TableTools;
