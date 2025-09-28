import { useState, useEffect } from "react";
import styles from "../RegisterClient/RegisterClient.module.css";
import api from "../../utils/api";
import { formatCnpj } from "../../utils/formatCnpj";
import { formatPhone } from "../../utils/formatPhone";

const UpdateClientPj = ({ clientId, updateClientPj, errors }) => {
  const [name, setName] = useState("");
  const [socialReason, setSocialReason] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phones, setPhones] = useState("");
  const [municipalRegistration, setMunicipalRegistration] = useState("");
  const [stateRegistration, setStateRegistration] = useState("");
  const [fantasyName, setFantasyName] = useState("");
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
        const {
          name,
          socialReason,
          cnpj,
          phones,
          addresses,
          municipalRegistration,
          stateRegistration,
          fantasyName,
        } = response.data;

        setName(name || "");
        setSocialReason(socialReason || "");
        setCnpj(cnpj || "");
        setPhones(phones && phones.length > 0 ? phones[0] : "");
        setAddresses(addresses?.length ? addresses[0] : {});
        setMunicipalRegistration(municipalRegistration || "");
        setStateRegistration(stateRegistration || "");
        setFantasyName(fantasyName || "");
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
      }
    };

    if (clientId) fetchClient();
  }, [clientId]);

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setAddresses((prev) => ({ ...prev, cep }));

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setAddresses((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddresses((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedClientPj = {
      name,
      socialReason,
      cnpj,
      phones: phones ? [phones] : [],
      addresses: [addresses],
      municipalRegistration,
      stateRegistration,
      fantasyName,
    };

    try {
      await updateClientPj(clientId, updatedClientPj);
      setSuccess("Cliente atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  const displayErrors = (field) => {
    if (Array.isArray(errors)) {
      return errors.filter((err) =>
        err.toLowerCase().includes(field.toLowerCase())
      );
    }
    return [];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Atualizar Cliente Pessoa Jurídica</h1>
        <p>Edite os dados abaixo e salve as alterações</p>
      </header>

      {success && !errors?.length && (
        <p className={styles.success}>{success}</p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Grid 1 */}
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {displayErrors("nome").length > 0 && (
              <p className={styles.errorMsg}>{displayErrors("nome").join(", ")}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Razão Social</label>
            <input
              type="text"
              value={socialReason}
              onChange={(e) => setSocialReason(e.target.value)}
            />
            {displayErrors("razão social").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("razão social").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>CNPJ</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => formatCnpj(e, setCnpj)}
            />
            {displayErrors("cnpj").length > 0 && (
              <p className={styles.errorMsg}>{displayErrors("cnpj").join(", ")}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Telefone</label>
            <input
              type="text"
              value={phones}
              onChange={(e) => formatPhone(e, setPhones)}
            />
            {displayErrors("telefone").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("telefone").join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Grid 2 */}
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Registro Municipal</label>
            <input
              type="text"
              value={municipalRegistration}
              onChange={(e) => setMunicipalRegistration(e.target.value)}
            />
            {displayErrors("municipal").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("municipal").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Registro Estadual</label>
            <input
              type="text"
              value={stateRegistration}
              onChange={(e) => setStateRegistration(e.target.value)}
            />
            {displayErrors("estadual").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("estadual").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              value={fantasyName}
              onChange={(e) => setFantasyName(e.target.value)}
            />
            {displayErrors("fantasia").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("fantasia").join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Endereço */}
        <h3 className={styles.sectionTitle}>Endereço</h3>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>CEP</label>
            <input
              type="text"
              value={addresses.cep}
              onChange={handleCepChange}
            />
            {displayErrors("cep").length > 0 && (
              <p className={styles.errorMsg}>{displayErrors("cep").join(", ")}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Rua</label>
            <input
              type="text"
              name="street"
              value={addresses.street}
              onChange={handleInputChange}
            />
            {displayErrors("rua").length > 0 && (
              <p className={styles.errorMsg}>{displayErrors("rua").join(", ")}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Número</label>
            <input
              type="text"
              name="number"
              value={addresses.number}
              onChange={handleInputChange}
            />
            {displayErrors("número").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("número").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Bairro</label>
            <input
              type="text"
              name="neighborhood"
              value={addresses.neighborhood}
              onChange={handleInputChange}
            />
            {displayErrors("bairro").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("bairro").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Cidade</label>
            <input
              type="text"
              name="city"
              value={addresses.city}
              onChange={handleInputChange}
            />
            {displayErrors("cidade").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("cidade").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Estado</label>
            <input
              type="text"
              name="state"
              value={addresses.state}
              onChange={handleInputChange}
            />
            {displayErrors("estado").length > 0 && (
              <p className={styles.errorMsg}>
                {displayErrors("estado").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Complemento</label>
            <input
              type="text"
              name="complement"
              value={addresses.complement}
              onChange={handleInputChange}
              placeholder="Opcional"
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

export default UpdateClientPj;
