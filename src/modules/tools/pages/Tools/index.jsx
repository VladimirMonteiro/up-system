import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../../../components/navbar/Navbar';
import Modal from '../../../../components/modal/Modal';
import ComponentMessage from '../../../../components/componentMessage/ComponentMessage';

import RegisterTool from '../../../../components/registerTool/RegisterTool';
import UpdateTool from '../../../../components/updateTool/UpdateTool';

import TableTools from '../../components/TableTools';
import ToolsSearch from '../../components/ToolsSearch';
import { useTools } from '../../hooks/useTools';

import styles from './Tools.module.css';

const Tools = () => {
  const {
    tools,
    loading,
    search,
    setSearch,
    page,
    totalPages,
    success,
    setSuccess,
    errors,
    setErrors,
    fetch,
    createTool,
    updateTool,
    deleteTool,
  } = useTools();

  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className='mainContainerFlex'>
      <Navbar />

      {success && (
        <ComponentMessage type='success' message={success} onClose={() => setSuccess(null)} />
      )}

      {errors && <ComponentMessage type='error' message={errors} onClose={() => setErrors(null)} />}

      <section className={styles.containerSection}>
        <h1>Ferramentas</h1>

        <ToolsSearch value={search} onChange={setSearch} onSubmit={() => fetch(0)} />

        <TableTools
          tools={tools}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onNext={() => fetch(page + 1)}
          onPrevious={() => fetch(page - 1)}
          onEdit={(tool) => {
            setSelectedTool(tool);
            setOpenUpdate(true);
          }}
          onView={(id) => navigate(`/ferramentas/${id}`)}
          onDelete={deleteTool}
        />

        <div className={styles.containerBtn}>
          <button onClick={() => setOpenCreate(true)}>Cadastrar Ferramenta</button>
        </div>

        <Modal isOpen={openCreate} onClose={() => setOpenCreate(false)}>
          <RegisterTool
            handleRegisterTool={async (data) => {
              const ok = await createTool(data);
              if (ok) setOpenCreate(false);
            }}
            errors={errors}
          />
        </Modal>

        <Modal isOpen={openUpdate} onClose={() => setOpenUpdate(false)}>
          <UpdateTool
            tool={selectedTool}
            handleUpdate={async (id, data) => {
              const ok = await updateTool(id, data);
              if (ok) setOpenUpdate(false);
            }}
            errors={errors}
          />
        </Modal>
      </section>
    </div>
  );
};

export default Tools;
