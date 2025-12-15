import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Table from "../../../components/tableClients/Table";
import styles from "./Clients.module.css";
import Modal from "../../../components/modal/Modal";
import RegisterClient from "../../../components/RegisterClient/RegisterClient";
import api from "../../../utils/api";
import UpdateClientFs from "../../../components/updateClientFs/UpdateClientFs";
import UpdateClientPj from "../../../components/updateClientsPj/UpdateClientPj";
import ComponentMessage from "../../../components/componentMessage/ComponentMessage";

const Clients = () => {
  const [modalClients, setModalClients] = useState(false);
  const [client, setClient] = useState({});
  const [clients, setClients] = useState([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState(null);
  const [errorsPj, setErrorsPj] = useState(null);
  const [errorsUpdate, setErrorsUpdate] = useState(null);
  const [errorsUpdatePj, setErrorsUpdatePj] = useState(null);
  const [modalUpdateClients, setModalUpdateClients] = useState(false);
  const [modalUpdateClientsPj, setModalUpdateClientsPj] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoadingClient(true);
        const response = await api.get("clients");
        setClients(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoadingClient(false);
      }
    };
    loadClients();
  }, []);

  const handleUpdateClient = async (e, id) => {
    try {
      const response = await api.get(`clients/${id}`);
      if (response.data) {
        setClient(response.data);
        response.data.cnpj
          ? setModalUpdateClientsPj(true)
          : setModalUpdateClients(true);
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  };

  // criar cliente FS
  const handleCreateClientFs = async (client) => {
    try {
      const response = await api.post("clients/createFs", client);

      if (!response.data?.errors) {
        const newClient =
          response.data?.client || response.data?.content || response.data;

        setClients((prev) =>
          Array.isArray(prev) ? [...prev, newClient] : [newClient]
        );

        setSuccess(response.data?.message || "Cliente cadastrado com sucesso!");
        setErrors(null);
      } else {
        setErrors(response.data.errors);
      }
      return response.data;
    } catch (error) {
      setErrors(error.response?.data?.errors || ["Erro inesperado"]);
      return { errors: true };
    }
  };

  // criar cliente PJ
  const handleCreateClientPj = async (client) => {
    try {
      const response = await api.post("clients/createPj", client);

      if (!response.data?.errors) {
        const newClient =
          response.data?.client || response.data?.content || response.data;

        setClients((prev) =>
          Array.isArray(prev) ? [...prev, newClient] : [newClient]
        );

        setSuccess(response.data?.message || "Cliente cadastrado com sucesso!");
        setErrorsPj(null);
        setModalClients(false);
      } else {
        setErrorsPj(response.data.errors);
      }
      return response.data;
    } catch (error) {
      setErrorsPj(error.response?.data?.errors || ["Erro inesperado"]);
      return { errors: true };
    }
  };

  // update FS
  const updateClientFs = async (id, updateClient) => {
    try {
      const response = await api.put(
        `/clients/update/clientFs/${id}`,
        updateClient
      );

      if (!response.data?.errors) {
        setClients((prev) =>
          prev.map((c) => (c.id === id ? response.data : c))
        );

        setSuccess(response.data?.message || "Cliente atualizado!");
        setErrorsUpdate(null);
        setModalUpdateClients(false);
      } else {
        setErrorsUpdate(response.data.errors);
      }
    } catch (error) {
      setErrorsUpdate(error.response?.data?.errors || ["Erro inesperado"]);
    }
  };

  // update PJ
  const updateClientPj = async (id, updateClient) => {
    try {
      const response = await api.put(
        `/clients/update/clientPj/${id}`,
        updateClient
      );

      if (!response.data?.errors) {
        setClients((prev) =>
          prev.map((c) => (c.id === id ? response.data : c))
        );

        setSuccess(response.data?.message || "Cliente atualizado!");
        setErrorsUpdatePj(null);
        setModalUpdateClientsPj(false);
      } else {
        setErrorsUpdatePj(response.data.errors);
      }
    } catch (error) {
      setErrorsUpdatePj(error.response?.data?.errors || ["Erro inesperado"]);
    }
  };

  return (
    <div className="mainContainerFlex">
    
      <Navbar />

      {success && (
        <ComponentMessage
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />
      )}

      <section className={styles.containerSection}>
        <div className="content">
          <h1>Clientes</h1>
          <Table
            selected={handleUpdateClient}
            clients={clients}
            loading={loadingClient}
            setLoadingClients={setLoadingClient}
          />
          <div className={styles.containerBtn}>
            <button onClick={() => setModalClients(true)}>Cadastrar Cliente</button>
          </div>
          {/* Cadastro */}
          <Modal
            isOpen={modalClients}
            onClose={() => setModalClients(false)}
            width="1000px"
            height="90vh"
            overflow="scroll"
          >
            <RegisterClient
              createClientFs={handleCreateClientFs}
              errors={errors}
              createClientPj={handleCreateClientPj}
              errorsPj={errorsPj}
            />
          </Modal>
          {/* Update FS */}
          <Modal
            isOpen={modalUpdateClients}
            onClose={() => setModalUpdateClients(false)}
            height="90vh"
            overflow="scroll"
          >
            <UpdateClientFs
              clientId={client?.id}
              clientFs={client}
              errors={errorsUpdate}
              updateClientFs={updateClientFs}
            />
          </Modal>
          {/* Update PJ */}
          <Modal
            isOpen={modalUpdateClientsPj}
            onClose={() => setModalUpdateClientsPj(false)}
            height="90vh"
            overflow="scroll"
          >
            <UpdateClientPj
              clientId={client?.id}
              errors={errorsUpdatePj}
              updateClientPj={updateClientPj}
            />
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Clients;
