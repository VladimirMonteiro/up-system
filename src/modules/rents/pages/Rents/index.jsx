import { useState } from 'react';
import MyMenu from '../../../../components/navbar/Navbar';
import RentsTable from '../../components/rents/RentTable';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../../components/modalConfirmDelete/confirmModal';
import { useRents } from '../../hooks/useRents';

const Rents = () => {
  const {
    rents,
    loading,
    notFound,
    page,
    totalPages,
    filters,
    fetchRents,
    deleteRent,
    completeRent,
    generatePdf,
    updateFilter,
    clearFilters,
  } = useRents();

  const [rentToDelete, setRentToDelete] = useState(null);
  const [rentToComplete, setRentToComplete] = useState(null);
  const navigate = useNavigate();

  return (
    <div className='mainContainerFlex'>
      <MyMenu />

      <RentsTable
        rents={rents}
        loading={loading}
        notFound={notFound}
        page={page}
        totalPages={totalPages}
        filters={filters}
        onPageChange={fetchRents}
        onFilterChange={updateFilter}
        onFilterSubmit={() => fetchRents(0)}
        onFilterClear={clearFilters}
        onDelete={(id) => setRentToDelete(id)}
        onComplete={(id) => setRentToComplete(id)}
        onPdf={generatePdf}
        onEdit={(id) => navigate(`/alugueis/${id}`)}
      />

      {/* MODAL EXCLUIR */}
      <ConfirmModal
        open={!!rentToDelete}
        danger
        title='Excluir locação'
        description='Tem certeza que deseja excluir esta locação? Esta ação não pode ser desfeita.'
        okText='Excluir'
        onConfirm={async () => {
          await deleteRent(rentToDelete);
          setRentToDelete(null);
        }}
        onCancel={() => setRentToDelete(null)}
      />

      {/* MODAL COMPLETAR */}
      <ConfirmModal
        open={!!rentToComplete}
        title='Completar locação'
        description='Deseja marcar esta locação como concluída?'
        okText='Concluir'
        onConfirm={async () => {
          await completeRent(rentToComplete);
          setRentToComplete(null);
        }}
        onCancel={() => setRentToComplete(null)}
      />
    </div>
  );
};

export default Rents;
