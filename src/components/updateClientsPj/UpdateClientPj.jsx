import { useState, useEffect } from "react";
import styles from "../RegisterClient/RegisterClient.module.css";
import api from "../../utils/api";
import {formatCnpj} from '../../utils/formatCnpj'
import {formatPhone} from '../../utils/formatPhone'

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
        const { name, socialReason, cnpj, phones, addresses, municipalRegistration, stateRegistration, fantasyName } = response.data;

        setName(name || "");
        setSocialReason(socialReason || "");
        setCnpj(cnpj || "");
        setPhones(phones && phones.length > 0 ? phones[0] : ""); // Apenas o primeiro telefone
        setAddresses(addresses?.length ? addresses[0] : {});
        setMunicipalRegistration(municipalRegistration || "");
        setStateRegistration(stateRegistration || "");
        setFantasyName(fantasyName || "");
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        // Definindo erros aqui
        setErrors(["Erro ao carregar dados do cliente."]);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
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

    const updatedClientPj = {
      name,
      socialReason,
      cnpj,
      phones: [phones], // Envia o telefone como um array com um único valor
      addresses: [addresses],
      municipalRegistration,
      stateRegistration,
      fantasyName,
    };

    console.log("Dados enviados:", updatedClientPj);

    await updateClientPj(clientId, updatedClientPj)
      .then(() => setSuccess("Cliente atualizado com sucesso!"))
      .catch((error) => console.error("Erro ao atualizar cliente:", error));
  };

  const displayErrors = (fieldName) => {
    if (Array.isArray(errors)) {
      return errors.filter((error) => error.toLowerCase().includes(fieldName.toLowerCase()));
    }
    return [];
  };

  return (
    <div>
      <h1>Atualizar Cliente Pessoa Jurídica</h1>
      {success && <p style={{ color: "#28a745", textAlign: "center" }}>{success}</p>}
     
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.form}>
          <div className={styles.inputContainer}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            {displayErrors("nome").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("nome").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="socialReason">Razão Social</label>
            <input
              type="text"
              name="socialReason"
              id="socialReason"
              onChange={(e) => setSocialReason(e.target.value)}
              value={socialReason}
            />
            {displayErrors("razão social").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("razão social").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              name="cnpj"
              id="cnpj"
              onChange={e => formatCnpj(e, setCnpj)}
              value={cnpj}
            />
            {displayErrors("CNPJ").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("CNPJ").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="phones">Telefone</label>
            <input
              type="text"
              name="phones"
              id="phones"
              onChange={(e) => formatPhone(e, setPhones)}
              value={phones}
            />
            {displayErrors("telefone").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("telefone").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="cep">CEP</label>
            <input
              type="text"
              name="cep"
              id="cep"
              value={addresses.cep}
              onChange={handleCepChange}
            />
            {displayErrors("CEP").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("CEP").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="municipalRegistration">Registro Municipal</label>
            <input
              type="text"
              name="municipalRegistration"
              id="municipalRegistration"
              onChange={(e) => setMunicipalRegistration(e.target.value)}
              value={municipalRegistration}
            />
            {displayErrors("registro do município").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("registro do município").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="stateRegistration">Registro Estadual</label>
            <input
              type="text"
              name="stateRegistration"
              id="stateRegistration"
              onChange={(e) => setStateRegistration(e.target.value)}
              value={stateRegistration}
            />
            {displayErrors("Registro do estado").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("Registro do estado").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="fantasyName">Nome fantasia</label>
            <input
              type="text"
              name="fantasyName"
              id="fantasyName"
              onChange={(e) => setFantasyName(e.target.value)}
              value={fantasyName}
            />
            {displayErrors("fantasia").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("fantasia").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="street">Endereço</label>
            <input
              type="text"
              name="street"
              id="street"
              value={addresses.street}
              onChange={handleInputChange}
            />
            {displayErrors("rua").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("rua").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="number">nº</label>
            <input
              type="text"
              name="number"
              id="number"
              value={addresses.number}
              onChange={handleInputChange}
            />
            {displayErrors("número").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("número").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="complement">Complemento</label>
            <input
              type="text"
              name="complement"
              id="complement"
              value={addresses.complement}
              onChange={handleInputChange}
              placeholder="Opcional"
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="neighborhood">Bairro</label>
            <input
              type="text"
              name="neighborhood"
              id="neighborhood"
              value={addresses.neighborhood}
              onChange={handleInputChange}
            />
            {displayErrors("bairro").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("bairro").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="city">Cidade</label>
            <input
              type="text"
              name="city"
              id="city"
              value={addresses.city}
              onChange={handleInputChange}
            />
            {displayErrors("cidade").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("cidade").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="state">Estado</label>
            <input
              type="text"
              name="state"
              id="state"
              value={addresses.state}
              onChange={handleInputChange}
            />
            {displayErrors("estado").length > 0 && (
              <p style={{ color: "red" }}>
                {displayErrors("estado").join(", ")}
              </p>
            )}
          </div>

          <div className={styles.inputContainer} style={{ marginTop: "35px" }}>
            <input type="submit" value="Atualizar" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateClientPj;
