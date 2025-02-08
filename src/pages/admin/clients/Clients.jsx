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
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);
  const [errorsPj, setErrorsPj] = useState(null);
  const [errorsUpdate, setErrorsUpdate] = useState(null);
  const [errorsUpdatePj, setErrorsUpdatePj] = useState(null);
  const [modalUpdateClients, setModalUpdateClients] = useState(false);
  const [modalUpdateClientsPj, setModalUpdateClientsPj] = useState(false);

  useEffect(() => {
    // Carregar os clientes ao montar o componente
    const loadClients = async () => {
      try {
        setLoadingClient(true); // Inicia o carregamento
        const response = await api.get("clients");
        setClients(response.data || []); // Definindo um array vazio caso a resposta não tenha dados
        setLoadingClient(false); // Finaliza o carregamento
      } catch (error) {
        setLoadingClient(false);
        console.error("Erro ao carregar clientes:", error);
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
        response.data.cnpj ? setModalUpdateClientsPj(true) : openModalUpdateClientFs();
      } else {
        console.error("Cliente não encontrado:", response);
      }
    } catch (error) {
      console.error("Erro ao obter cliente:", error);
    }
  };

  const handleCreateClientFs = async (client) => {
    try {
      const response = await api.post("clients/createFs", client);
      setClients((prevClients) => [...prevClients, response.data]);
      setSuccess(response.data.message);
      setErrors(null);
    } catch (error) {
      setErrors(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao criar cliente (FS):", error);
    }
  };

  const handleCreateClientPj = async (client) => {
    try {
      const response = await api.post("clients/createPj", client);
      setClients((prevClients) => [...prevClients, response.data]);
      setSuccess(response.data.message);
      setErrorsPj(null);
    } catch (error) {
      setErrorsPj(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao criar cliente (PJ):", error);
    }
  };

  const updateClientFs = async (id, updateClient) => {
    try {
      const response = await api.put(`/clients/update/clientFs/${id}`, updateClient);
      setClients((prevClients) =>
        prevClients.map((client) => (client.id === id ? response.data : client))
      );
      setModalUpdateClients(false);
      setSuccess(response.data.message);
      setErrorsUpdate(null);
    } catch (error) {
      setErrorsUpdate(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao atualizar cliente FS:", error);
    }
  };

  const updateClientPj = async (id, updateClient) => {
    try {
      const response = await api.put(`/clients/update/clientPj/${id}`, updateClient);
      setClients((prevClients) =>
        prevClients.map((client) => (client.id === id ? response.data : client))
      );
      setModalUpdateClientsPj(false);
      setSuccess(response.data.message);
      setErrorsUpdatePj(null);
    } catch (error) {
      setErrorsUpdatePj(error.response?.data?.errors || "Erro inesperado");
      console.error("Erro ao atualizar cliente PJ:", error);
    }
  };

  return (
    <>
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
        <Modal isOpen={modalClients} onClose={closeModalClient} width="1400px" height="auto">
          <RegisterClient
            createClientFs={handleCreateClientFs}
            errors={errors}
            createClientPj={handleCreateClientPj}
            errorsPj={errorsPj}
          />
        </Modal>
        <Modal isOpen={modalUpdateClients} onClose={closeModalUpdateClientFs}>
          <UpdateClientFs
            clientId={client?.id}
            clientFs={client}
            errors={errorsUpdate}
            updateClientFs={updateClientFs}
          />
        </Modal>
        <Modal isOpen={modalUpdateClientsPj} onClose={closeModalUpdateClientPj} height={"auto"}>
          <UpdateClientPj clientId={client?.id} errors={errorsUpdatePj} updateClientPj={updateClientPj} />
        </Modal>
      </section>
    </>
  );
};

export default Clients;
