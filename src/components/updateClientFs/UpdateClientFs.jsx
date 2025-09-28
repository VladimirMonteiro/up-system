import { useState, useEffect } from "react";
import styles from "../RegisterClient/RegisterClient.module.css";
import api from "../../utils/api";
import { formatCPF } from "../../utils/formatCpf";
import { formatPhone } from "../../utils/formatPhone";

const UpdateClientFs = ({ clientId, updateClientFs, errors }) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState(""); 
  const [addresses, setAddresses] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/clients/${clientId}`);
        const { name, cpf, phones, addresses } = response.data;

        setName(name || "");
        setCpf(cpf || "");
        setPhone(phones && phones.length > 0 ? phones[0] : "");
        setAddresses(addresses?.length ? addresses[0] : {});
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setAddresses((prev) => ({ ...prev, cep }));

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          alert("CEP não encontrado!");
          return;
        }

        setAddresses((prev) => ({
          ...prev,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar o CEP. Tente novamente.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddresses((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedClientFs = {
      name,
      cpf,
      phones: phone && phone[0] !== "" ? [phone] : null,
      addresses: [addresses],
    };

    const response = await updateClientFs(clientId, updatedClientFs);

    if (!response?.errors) {
      setSuccess("Cliente PF atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const getError = (field) => {
    if (!errors) return null;
    return errors.find((err) => err.toLowerCase().includes(field));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Atualizar Cliente Pessoa Física</h1>
      </header>

      {success && !errors && <p className={styles.success}>{success}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {getError("nome") && <p className={styles.errorMsg}>{getError("nome")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>CPF</label>
            <input
              type="text"
              maxLength={14}
              value={cpf}
              onChange={(e) => formatCPF(e, setCpf)}
            />
            {getError("cpf") && <p className={styles.errorMsg}>{getError("cpf")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Telefone</label>
            <input
              type="text"
              maxLength={15}
              value={phone}
              onChange={(e) => formatPhone(e, setPhone)}
            />
            {getError("telefone") && <p className={styles.errorMsg}>{getError("telefone")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>CEP</label>
            <input
              type="text"
              value={addresses.cep}
              onChange={handleCepChange}
            />
            {getError("cep") && <p className={styles.errorMsg}>{getError("cep")}</p>}
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Endereço</h3>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Rua</label>
            <input
              type="text"
              name="street"
              value={addresses.street}
              onChange={handleInputChange}
            />
            {getError("rua") && <p className={styles.errorMsg}>{getError("rua")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Número</label>
            <input
              type="text"
              name="number"
              value={addresses.number}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Bairro</label>
            <input
              type="text"
              name="neighborhood"
              value={addresses.neighborhood}
              onChange={handleInputChange}
            />
            {getError("bairro") && <p className={styles.errorMsg}>{getError("bairro")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Cidade</label>
            <input
              type="text"
              name="city"
              value={addresses.city}
              onChange={handleInputChange}
            />
            {getError("cidade") && <p className={styles.errorMsg}>{getError("cidade")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Estado</label>
            <input
              type="text"
              name="state"
              value={addresses.state}
              onChange={handleInputChange}
            />
            {getError("estado") && <p className={styles.errorMsg}>{getError("estado")}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label>Complemento</label>
            <input
              type="text"
              name="complement"
              value={addresses.complement}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Atualizar Cliente
        </button>
      </form>
    </div>
  );
};

export default UpdateClientFs;
