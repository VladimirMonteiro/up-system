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
  const [clients, setClients] = useState([]); // sempre array
  const [loadingClient, setLoadingClient] = useState(true);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState(null);
  const [errorsPj, setErrorsPj] = useState(null);
  const [errorsUpdate, setErrorsUpdate] = useState(null);
  const [errorsUpdatePj, setErrorsUpdatePj] = useState(null);
  const [modalUpdateClients, setModalUpdateClients] = useState(false);
  const [modalUpdateClientsPj, setModalUpdateClientsPj] = useState(false);

  // carregar clientes ao montar
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

  const openModalClient = () => setModalClients(true);
  const closeModalClient = () => setModalClients(false);

  const openModalUpdateClientFs = () => setModalUpdateClients(true);
  const closeModalUpdateClientFs = () => setModalUpdateClients(false);

  const openModalUpdateClientPj = () => setModalUpdateClientsPj(true);
  const closeModalUpdateClientPj = () => setModalUpdateClientsPj(false);

  const handleUpdateClient = async (e, id) => {
    try {
      const response = await api.get(`clients/${id}`);
      if (response.data) {
        setClient(response.data);
        response.data.cnpj
          ? setModalUpdateClientsPj(true)
          : openModalUpdateClientFs();
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  };

  // criar cliente FS
  const handleCreateClientFs = async (client) => {
    try {
      const response = await api.post("clients/createFs", client);

      const newClient =
        response.data?.client || response.data?.content || response.data;

      setClients((prev) =>
        Array.isArray(prev) ? [...prev, newClient] : [newClient]
      );

      setSuccess(response.data?.message || "Cliente cadastrado com sucesso!");
      setErrors(null);
          window.scrollTo({ top: 0, behavior: "instant" }); // 🔹 sobe para o topo

      closeModalClient();
    } catch (error) {
      setErrors(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao criar cliente (FS):", error);
    }
  };

  // criar cliente PJ
  const handleCreateClientPj = async (client) => {
    try {
      const response = await api.post("clients/createPj", client);

      const newClient =
        response.data?.client || response.data?.content || response.data;

      setClients((prev) =>
        Array.isArray(prev) ? [...prev, newClient] : [newClient]
      );

      setSuccess(response.data?.message || "Cliente cadastrado com sucesso!");
      setErrorsPj(null);
      closeModalClient();
    } catch (error) {
      setErrorsPj(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao criar cliente (PJ):", error);
    }
  };

  // update FS
  const updateClientFs = async (id, updateClient) => {
    try {
      const response = await api.put(
        `/clients/update/clientFs/${id}`,
        updateClient
      );

      setClients((prev) =>
        prev.map((c) => (c.id === id ? response.data : c))
      );

      setSuccess(response.data?.message || "Cliente atualizado!");
      setErrorsUpdate(null);
      closeModalUpdateClientFs();
    } catch (error) {
      setErrorsUpdate(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao atualizar cliente FS:", error);
    }
  };

  // update PJ
  const updateClientPj = async (id, updateClient) => {
    try {
      const response = await api.put(
        `/clients/update/clientPj/${id}`,
        updateClient
      );

      setClients((prev) =>
        prev.map((c) => (c.id === id ? response.data : c))
      );

      setSuccess(response.data?.message || "Cliente atualizado!");
      setErrorsUpdatePj(null);
      closeModalUpdateClientPj();
    } catch (error) {
      setErrorsUpdatePj(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao atualizar cliente PJ:", error);
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
        <h1>Clientes</h1>

        <Table
          selected={handleUpdateClient}
          clients={clients}
          loading={loadingClient}
          setLoadingClients={setLoadingClient}
        />

        <div className={styles.containerBtn}>
          <button onClick={openModalClient}>Cadastrar Cliente</button>
        </div>

        {/* Cadastro */}
        <Modal
          isOpen={modalClients}
          onClose={closeModalClient}
          width="1400px"
          height="auto"
        >
          <RegisterClient
            createClientFs={handleCreateClientFs}
            errors={errors}
            createClientPj={handleCreateClientPj}
            errorsPj={errorsPj}
          />
        </Modal>

        {/* Update FS */}
        <Modal isOpen={modalUpdateClients} onClose={closeModalUpdateClientFs}>
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
          onClose={closeModalUpdateClientPj}
          height="auto"
        >
          <UpdateClientPj
            clientId={client?.id}
            errors={errorsUpdatePj}
            updateClientPj={updateClientPj}
          />
        </Modal>
      </section>
    </div>
  );
};

export default Clients;
