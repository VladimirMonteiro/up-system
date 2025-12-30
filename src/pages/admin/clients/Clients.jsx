import { useState, useEffect } from 'react';
import Navbar from '../../../components/navbar/Navbar';
import Table from '../../../components/tableClients/Table';
import styles from './Clients.module.css';
import Modal from '../../../components/modal/Modal';
import RegisterClient from '../../../components/RegisterClient/RegisterClient';
import api from '../../../utils/api';
import UpdateClientFs from '../../../components/updateClientFs/UpdateClientFs';
import UpdateClientPj from '../../../components/updateClientsPj/UpdateClientPj';
import ComponentMessage from '../../../components/componentMessage/ComponentMessage';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState(null);
  const [errorsUpdate, setErrorsUpdate] = useState(null);
  const [errorsUpdatePj, setErrorsUpdatePj] = useState(null);

  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdateFs, setModalUpdateFs] = useState(false);
  const [modalUpdatePj, setModalUpdatePj] = useState(false);

  /* ===============================
     BUSCAR CLIENTES (ÚNICA FONTE)
  =============================== */
  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/clients");

      const data = response.data?.content || response.data;
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  /* ===============================
     CRIAR CLIENTE (FS ou PJ)
  =============================== */
  const handleCreateClient = async (clientData) => {
    try {
      const response = await api.post("/clients/create", clientData);

      if (response.data?.errors) {
        setErrors(response.data.errors);
        return;
      }

      setErrors(null);
      setSuccess("Cliente cadastrado com sucesso!");
      setModalCreate(false);

      await loadClients(); // 🔥 AQUI ESTÁ O SEGREDO
    } catch (error) {
      setErrors(error.response?.data?.errors || ["Erro inesperado"]);
    }
  };

  /* ===============================
     ABRIR MODAL UPDATE
  =============================== */
  const handleSelectClient = async (_, id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      setClient(response.data);

      response.data.cnpj
        ? setModalUpdatePj(true)
        : setModalUpdateFs(true);
    } catch (error) {
      console.error("Erro ao buscar cliente", error);
    }
  };

  /* ===============================
     UPDATE FS
  =============================== */
  const updateClientFs = async (id, data) => {
    try {
      const response = await api.put(`/clients/${id}`, {...data, type: "clientFS"});

      if (response.data?.errors) {
        setErrorsUpdate(response.data.errors);
        return;
      }

      setModalUpdateFs(false);
      setSuccess("Cliente atualizado com sucesso!");
      await loadClients();
    } catch (error) {
      setErrorsUpdate(error.response?.data?.errors || ["Erro inesperado"]);
    }
  };

  /* ===============================
     UPDATE PJ
  =============================== */
  const updateClientPj = async (id, data) => {
    try {
      const response = await api.put(`/clients/${id}`, {...data, type: "clientPJ"});

      if (response.data?.errors) {
        setErrorsUpdatePj(response.data.errors);
        return;
      }

      setModalUpdatePj(false);
      setSuccess("Cliente atualizado com sucesso!");
      await loadClients();
    } catch (error) {
      setErrorsUpdatePj(error.response?.data?.errors || ["Erro inesperado"]);
    }
  };

  return (
    <div className="mainContainerFlex">
      <Navbar />

      {success && (
        <ComponentMessage
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <section className={styles.containerSection}>
        <div className="content">
          <h1>Clientes</h1>

          <Table
            clients={clients}
            loading={loading}
            selected={handleSelectClient}
          />

          <div className={styles.containerBtn}>
            <button onClick={() => setModalCreate(true)}>
              Cadastrar Cliente
            </button>
          </div>

          {/* CREATE */}
          <Modal
            isOpen={modalCreate}
            onClose={() => setModalCreate(false)}
            width="1000px"
            height="90vh"
            overflow="scroll"
          >
            <RegisterClient
              createClient={handleCreateClient}
              errors={errors}
            />
          </Modal>

          {/* UPDATE FS */}
          <Modal
            isOpen={modalUpdateFs}
            onClose={() => setModalUpdateFs(false)}
            height="90vh"
            overflow="scroll"
          >
            <UpdateClientFs
              clientId={client?.id}
              clientFs={client}
              updateClientFs={updateClientFs}
              errors={errorsUpdate}
            />
          </Modal>

          {/* UPDATE PJ */}
          <Modal
            isOpen={modalUpdatePj}
            onClose={() => setModalUpdatePj(false)}
            height="90vh"
            overflow="scroll"
          >
            <UpdateClientPj
              clientId={client?.id}
              updateClientPj={updateClientPj}
              errors={errorsUpdatePj}
            />
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Clients;