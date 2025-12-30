import { useState } from "react";
import styles from "./RegisterClient.module.css";
import { formatCPF } from "../../utils/formatCpf";
import { formatCnpj } from "../../utils/formatCnpj";
import { formatPhone } from "../../utils/formatPhone";
import api from "../../utils/api";

const RegisterClient = ({ createClient, errors, createClientPj, errorsPj }) => {
    const [selectedForm, setSelectedForm] = useState("pf");
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [phones, setPhones] = useState("");
    const [success, setSuccess] = useState(null);
    const [addresses, setAddresses] = useState({
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
    });

    const [stateRegistration, setStateRegistration] = useState("");
    const [municipalRegistration, setMunicipalRegistration] = useState("");
    const [fantasyName, setFantasyName] = useState("");
    const [socialReason, setSocialReason] = useState("");
    const [cnpj, setCnpj] = useState("");

    const handleFormSwitch = (formType) => {
        setSelectedForm(formType);
    };

    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, "");
        setAddresses({ ...addresses, cep });

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
        setAddresses({ ...addresses, [name]: value });
    };

    const handleCnpjChange = async (e) => {
        let cnpjValue = formatCnpj(e);
        setCnpj(cnpjValue);
        const cleanedCnpj = cnpjValue.replace(/\D/g, "");

        if (cleanedCnpj.length === 14) {
            try {
                const response = await api.get(
                    `clients/consultaCnpjReceitaWs/${cleanedCnpj}`
                );
                const data = response.data;

                setName(data.nome || "");
                setPhones(data.telefone || "");
                setFantasyName(data.fantasia || "");
                setAddresses({
                    cep: data.cep || "",
                    street: data.logradouro || "",
                    number: data.numero || "",
                    complement: data.complemento || "",
                    neighborhood: data.bairro || "",
                    city: data.municipio || "",
                    state: data.uf || "",
                });
            } catch (error) {
                console.error("Erro ao buscar CNPJ:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedForm === "pf") {
                const newClientFs = {
                    name,
                    type: "clientFS",
                    cpf,
                    phones: phones ? [phones] : null,
                    addresses: [addresses],
                };

                const response = await createClient(newClientFs);

                if (!response?.errors) {
                    resetForm();
                    setSuccess("Cliente PF cadastrado com sucesso!");
                }
            } else {
                const newClientPj = {
                    name,
                    type: "clientPJ",
                    cnpj,
                    phones: phones ? [phones] : null,
                    addresses: [addresses],
                    socialReason,
                    fantasyName,
                    stateRegistration,
                    municipalRegistration,
                };

                const response = await createClient(newClientPj);

                if (!response?.errors) {
                    resetForm();
                    setSuccess("Cliente PJ cadastrado com sucesso!");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const resetForm = () => {
        setName("");
        setCpf("");
        setPhones("");
        setCnpj("");
        setSocialReason("");
        setFantasyName("");
        setStateRegistration("");
        setMunicipalRegistration("");

        setAddresses({
            cep: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
        });

        setTimeout(() => {
            setSuccess(null);
        }, 3000);
    };

    

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Cadastro de Cliente</h1>
                <p>Selecione o tipo de cliente e preencha os dados abaixo</p>
            </header>

            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tab} ${selectedForm === "pf" ? styles.active : ""
                        }`}
                    onClick={() => handleFormSwitch("pf")}
                >
                    Pessoa Física
                </button>
                <button
                    className={`${styles.tab} ${selectedForm === "pj" ? styles.active : ""
                        }`}
                    onClick={() => handleFormSwitch("pj")}
                >
                    Pessoa Jurídica
                </button>
            </div>

            {success && !errors && !errorsPj && (
                <p className={styles.success}>{success}</p>
            )}

            {errors && (
                <p className={styles.errorMsg}>
                    {errors.find((err) => err.toLowerCase().includes("cliente"))}
                </p>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Pessoa Física */}
                {selectedForm === "pf" && (
                    <>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors && (
                                    <p className={styles.errorMsg}>
                                        {errors.find((err) => err.toLowerCase().includes("nome"))}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>CPF</label>
                                <input
                                    type="text"
                                    maxLength={14}
                                    value={cpf}
                                    onChange={(e) => formatCPF(e, setCpf)}
                                />
                                {errors && (
                                    <p className={styles.errorMsg}>
                                        {errors.find((err) => err.toLowerCase().includes("cpf"))}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Telefone</label>
                                <input
                                    type="text"
                                    maxLength={15}
                                    value={phones}
                                    onChange={(e) => formatPhone(e, setPhones)}
                                />
                                {errors && (
                                    <p className={styles.errorMsg}>
                                        {errors.find((err) => err.toLowerCase().includes("telefone"))}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>CEP</label>
                                <input
                                    type="text"
                                    value={addresses.cep}
                                    onChange={handleCepChange}
                                />
                                {errors && (
                                    <p className={styles.errorMsg}>
                                        {errors.find((err) => err.toLowerCase().includes("cep"))}
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Pessoa Jurídica */}
                {selectedForm === "pj" && (
                    <>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errorsPj && (
                                    <p className={styles.errorMsg}>
                                        {errorsPj.find((err) => err.toLowerCase().includes("nome"))}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Razão Social</label>
                                <input
                                    type="text"
                                    value={socialReason}
                                    onChange={(e) => setSocialReason(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>CNPJ</label>
                                <input
                                    type="text"
                                    maxLength={18}
                                    value={cnpj}
                                    onChange={handleCnpjChange}
                                />
                                {errorsPj && (
                                    <p className={styles.errorMsg}>
                                        {errorsPj.find((err) => err.toLowerCase().includes("cnpj"))}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Telefone</label>
                                <input
                                    type="text"
                                    maxLength={15}
                                    value={phones}
                                    onChange={(e) => formatPhone(e, setPhones)}
                                />
                                {errorsPj && (
                                    <p className={styles.errorMsg}>
                                        {errorsPj.find((err) => err.toLowerCase().includes("telefone"))}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label>Registro Municipal</label>
                                <input
                                    type="text"
                                    value={municipalRegistration}
                                    onChange={(e) => setMunicipalRegistration(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Registro Estadual</label>
                                <input
                                    type="text"
                                    value={stateRegistration}
                                    onChange={(e) => setStateRegistration(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Nome Fantasia</label>
                                <input
                                    type="text"
                                    value={fantasyName}
                                    onChange={(e) => setFantasyName(e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Endereço */}
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
                        {errorsPj && (
                            <p className={styles.errorMsg}>
                                {errorsPj.find((err) => err.toLowerCase().includes("rua"))}
                            </p>
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
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Bairro</label>
                        <input
                            type="text"
                            name="neighborhood"
                            value={addresses.neighborhood}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Cidade</label>
                        <input
                            type="text"
                            name="city"
                            value={addresses.city}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Estado</label>
                        <input
                            type="text"
                            name="state"
                            value={addresses.state}
                            onChange={handleInputChange}
                        />
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
                    Cadastrar Cliente
                </button>
            </form>
        </div>
    );
};

export default RegisterClient;
