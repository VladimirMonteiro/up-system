import { useState, useEffect } from "react";
import styles from "../RegisterClient/RegisterClient.module.css";
import api from "../../utils/api";

const UpdateClientFs = ({ clientId, updateClientFs, errors }) => {
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState(""); // Apenas o primeiro telefone
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
                setPhone(phones && phones.length > 0 ? phones[0] : ""); // Apenas o primeiro telefone
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

        const updatedClientFs = {
            name,
            cpf,
            phones: phone && phone[0] != "" ? [phone] : null, // Envia o telefone como um array contendo apenas o primeiro
            addresses: [addresses],
        };

        
           await updateClientFs(clientId, updatedClientFs)
        
    };

    return (
        <div>
            <h1>Atualizar Cliente Pessoa Física</h1>
            {success && <p style={{ color: "#28a745", textAlign: "center" }}>{success}</p>}
            {errors && errors.length > 0 && (
                <p style={{ color: "red", textAlign: "center" }}>{errors.filter(error => error.includes("Cliente"))}</p>
            )}

            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.form}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="name">Nome</label>
                        <input type="text" name="name" id="name" onChange={e => setName(e.target.value)} value={name} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("nome"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="cpf">CPF</label>
                        <input type="text" name="cpf" id="cpf" onChange={e => setCpf(e.target.value)} value={cpf} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("CPF"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="phones">Telefone</label>
                        <input type="text" name="phones" id="phones" onChange={e => setPhone(e.target.value)} value={phone} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("telefone"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="cep">CEP</label>
                        <input type="text" name="cep" id="cep" value={addresses.cep} onChange={handleCepChange} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("CEP"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="street">Rua</label>
                        <input type="text" name="street" id="street" value={addresses.street} onChange={handleInputChange} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("rua"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="number">Número</label>
                        <input type="text" name="number" id="number" value={addresses.number} onChange={handleInputChange} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("número"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="complement">Complemento</label>
                        <input type="text" name="complement" id="complement" value={addresses.complement} onChange={handleInputChange} />
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="neighborhood">Bairro</label>
                        <input type="text" name="neighborhood" id="neighborhood" value={addresses.neighborhood} onChange={handleInputChange} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("bairro"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="city">Cidade</label>
                        <input type="text" name="city" id="city" value={addresses.city} onChange={handleInputChange} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("cidade"))}</p>
                        )}
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="state">Estado</label>
                        <input type="text" name="state" id="state" value={addresses.state} onChange={handleInputChange} />
                        {errors && errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("estado"))}</p>
                        )}
                    </div>
                </div>

                <div className={styles.containerBtn}>
                    <div className={styles.inputContainer}>
                        <input type="submit" value="Atualizar" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateClientFs;
