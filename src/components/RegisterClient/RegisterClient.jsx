import { useState } from "react";
import styles from './RegisterClient.module.css';
import { formatCPF } from "../../utils/formatCpf";
import { formatCnpj } from "../../utils/formatCnpj";
import { formatPhone } from "../../utils/formatPhone";
import api from "../../utils/api";

const RegisterClient = ({createClientFs, errors, createClientPj, errorsPj}) => {
    const [selectedForm, setSelectedForm] = useState("pf"); // "pf" para Pessoa Física e "pj" para Pessoa Jurídica
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [phones, setPhones] = useState(undefined);
    const [sucess, setSuccess] = useState(null);
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
        console.log(formType);
    };

    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        setAddresses({ ...addresses, cep });

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
        setAddresses({ ...addresses, [name]: value });
    };
 

    const handleCnpjChange = async (e) => {
        let cnpjValue = formatCnpj(e); // Formata o CNPJ com pontos, barras, etc.
        setCnpj(cnpjValue);  // Atualiza o estado com o CNPJ formatado
    
        // Remove qualquer caractere não numérico após formatação
        const cleanedCnpj = cnpjValue.replace(/\D/g, "");
        console.log(cleanedCnpj); // Agora 'cleanedCnpj' tem apenas os números do CNPJ
    
        // Verifica se o CNPJ tem exatamente 14 dígitos (sem formatação)
        if (cleanedCnpj.length === 14) {
            try {
                // Realiza a consulta à API utilizando o CNPJ limpo (sem pontos, barras, etc.)
                const response = await api.get(`clients/consultaCnpjReceitaWs/${cleanedCnpj}`);
                const data = response.data;
        
                console.log(data);
    
                // Atualiza os estados com as informações do CNPJ
                setName(data.nome || "");
                setPhones(data.telefone || "");
                setFantasyName(data.fantasia || "");
    
                // Preenche os dados de endereço
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
                alert("Erro ao buscar o CNPJ. Tente novamente.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newClientFs = {
            name,
            cpf,
            phones: phones != null ? [phones] : null,
            addresses: [addresses]
        };

        try {
            if (selectedForm === "pf") {
                const response = await createClientFs(newClientFs)
            
                if(!response) {
                    
                setName("");
                setCpf("");
                setPhones("");

                const emptyAddress = Object.keys(addresses).reduce((acc, key) => {
                    acc[key] = ""; // Define cada atributo como ""
                    return acc;
                }, {});
                setAddresses(emptyAddress);

                setTimeout(() => {
                    setSuccess(null);
                }, 3000);

                }

            } else {
                const newClientPj = {
                    name,
                    cnpj,
                    phones: phones != null ? [phones] : null,
                    addresses: [addresses],
                    socialReason,
                    fantasyName,
                    stateRegistration,
                    municipalRegistration
                };

                const response = await createClientPj(newClientPj)
             
                if(!response) {

                    setName("");
                    setCnpj("");
                    setPhones("");
                    setSocialReason("");
                    setFantasyName("");
                    setStateRegistration("");
                    setMunicipalRegistration("");
                   
    
                    const emptyAddress = Object.keys(addresses).reduce((acc, key) => {
                        acc[key] = ""; // Define cada atributo como ""
                        return acc;
                    }, {});
                    setAddresses(emptyAddress);
    
                    setTimeout(() => {
                        setSuccess(null);
                    }, 3000);
                }
            }
        } catch (error) {
            console.log(error)
           
        }
    };

    return (
        <div>
            <h1>Cadastro de Cliente</h1>
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => handleFormSwitch("pf")}
                    style={{
                        backgroundColor: selectedForm === "pf" ? "#007BFF" : "#f0f0f0",
                        color: selectedForm === "pf" ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        padding: "10px 20px",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                >
                    Pessoa Física
                </button>
                <button
                    onClick={() => handleFormSwitch("pj")}
                    style={{
                        backgroundColor: selectedForm === "pj" ? "#007BFF" : "#f0f0f0",
                        color: selectedForm === "pj" ? "#fff" : "#000",
                        border: "1px solid #ccc",
                        padding: "10px 20px",
                        cursor: "pointer",
                    }}
                >
                    Pessoa Jurídica
                </button>
            </div>

            {sucess && <p style={{ color: "#28a745", textAlign: "center" }}>{sucess}</p>}
            {errors && errors.length > 0 && (
                <p style={{ color: "red", textAlign: "center" }}>{errors.filter(error => error.includes("Cliente já"))}</p>)}

            {/* Formulário de Pessoa Física */}
            {selectedForm === "pf" && (
                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    <div className={styles.form}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="name">Nome</label>
                            <input type="text" name="name" id="name" onChange={e => setName(e.target.value)} value={name || ""} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("nome"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" name="cpf" id="cpf" onChange={e => formatCPF(e, setCpf)} value={cpf || ""} maxLength={14}/>
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("CPF"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="phones">Telefone</label>
                            <input type="text" name="phones" id="phones" onChange={e => formatPhone(e, setPhones)} value={phones || ""} maxLength={15} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("telefone"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="cep">CEP</label>
                            <input type="text" name="cep" id="cep" value={addresses.cep} onChange={handleCepChange} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("CEP"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="street">Endereço</label>
                            <input type="text" name="street" id="street" value={addresses.street} onChange={handleInputChange} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("rua"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="number">nº</label>
                            <input type="text" name="number" id="number" value={addresses.number} onChange={handleInputChange} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("número"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="complement">Complemento</label>
                            <input type="text" name="complement" id="complement" value={addresses.complement} onChange={handleInputChange} placeholder="Opcional"/>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="neighborhood">Bairro</label>
                            <input type="text" name="neighborhood" id="neighborhood" value={addresses.neighborhood} onChange={handleInputChange} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("bairro"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="city">Cidade</label>
                            <input type="text" name="city" id="city" value={addresses.city} onChange={handleInputChange} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("cidade"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="state">Estado</label>
                            <input type="text" name="state" id="state" value={addresses.state} onChange={handleInputChange} />
                            {errors && errors.length > 0 && (
                                <p style={{ color: "red" }}>{errors.filter(error => error.includes("estado"))}</p>)}
                        </div>
                    </div>
                    <div className={styles.containerBtn}>
                        <div className={styles.inputContainer}>
                            <input type="submit" value="Cadastrar" />
                        </div>
                    </div>
                </form>
            )}

            {/* Formulário de Pessoa Jurídica */}
            {selectedForm === "pj" && (
                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    <div className={styles.form}>
                        <div className={styles.inputContainer}>
                            <label htmlFor="name">Nome</label>
                            <input type="text" name="name" id="name" onChange={e => setName(e.target.value)} value={name || ""} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("nome"))}</p>)}
                        </div>

                        <div className={styles.inputContainer}>
                            <label htmlFor="socialReason">Razão Social</label>
                            <input type="text" name="socialReason" id="socialReason" onChange={e => setSocialReason(e.target.value)} value={socialReason || ""} placeholder="Opcional"/>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="cnpj">CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                id="cnpj"
                                onChange={handleCnpjChange}
                                value={cnpj}
                                maxLength={"18"}
                            />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("CNPJ"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="phones">Telefone</label>
                            <input type="text" name="phones" id="phones" onChange={e => formatPhone(e, setPhones)} value={phones || ""} maxLength={15} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("telefone"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="cep">CEP</label>
                            <input type="text" name="cep" id="cep" value={addresses.cep} onChange={handleCepChange} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("CEP"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="municipalRegistration">Registro Municipal</label>
                            <input type="text" name="municipalRegistration" id="municipalRegistration" onChange={e => setMunicipalRegistration(e.target.value)} value={municipalRegistration || ""} placeholder="Opcional" />
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="stateRegistration">Registro Estadual</label>
                            <input type="text" name="stateRegistration" id="stateRegistration" onChange={e => setStateRegistration(e.target.value)} value={stateRegistration || ""} placeholder="Opcional" />
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="fantasyName">Nome fantasia</label>
                            <input type="text" name="fantasyName" id="fantasyName" onChange={e => setFantasyName(e.target.value)} value={fantasyName || ""} placeholder="Opcional" />
                            
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="street">Endereço</label>
                            <input type="text" name="street" id="street" value={addresses.street} onChange={handleInputChange} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("rua"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="number">nº</label>
                            <input type="text" name="number" id="number" value={addresses.number || ""} onChange={handleInputChange} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("número"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="complement">Complemento</label>
                            <input type="text" name="complement" id="complement" value={addresses.complement || ""} onChange={handleInputChange} placeholder="Opcional" />
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="neighborhood">Bairro</label>
                            <input type="text" name="neighborhood" id="neighborhood" value={addresses.neighborhood || ""} onChange={handleInputChange} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("bairro"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="city">Cidade</label>
                            <input type="text" name="city" id="city" value={addresses.city || ""} onChange={handleInputChange} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("cidade"))}</p>)}
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="state">Estado</label>
                            <input type="text" name="state" id="state" value={addresses.state || ""} onChange={handleInputChange} />
                            {errorsPj && errorsPj.length > 0 && (
                                <p style={{ color: "red" }}>{errorsPj.filter(error => error.includes("estado"))}</p>)}
                        </div>

                        <div className={styles.inputContainer} style={{ marginTop: "35px" }}>
                            <input type="submit" value="Cadastrar" />
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default RegisterClient;
