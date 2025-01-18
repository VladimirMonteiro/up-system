import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handlePriceChange } from '../../../utils/handlePriceChange'


import Navbar from '../../../components/navbar/Navbar'
import Modal from '../../../components/modal/Modal'
import Table from '../../../components/tableClients/Table'
import TableTools from '../../../components/tableTools/TableTools'
import api from '../../../utils/api'

import styles from './CreateRent.module.css'



const CreateRent = () => {

    const [client, setClient] = useState({})
    const [tool, setTool] = useState("")
    const [initialDate, setInitalDate] = useState("")
    const [deliveryDate, setDeliveryDate] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState(null)
    const [meters, setMeters] = useState("")
    const [listItems, setListItems] = useState([])
    const navigate = useNavigate()

    const [isClientModalOpen, setClientModalOpen] = useState(false); // Estado para o modal de cliente
    const [isToolModalOpen, setToolModalOpen] = useState(false); // Estado para o modal de ferramenta


    useEffect(() => {
        console.log("A lista foi atualizada:", listItems);

    }, [listItems])



    const openClients = (e) => {
        e.preventDefault();
        setClientModalOpen(true); // Abre o modal de clientes
    };

    const openTools = (e) => {
        e.preventDefault();
        setToolModalOpen(true); // Abre o modal de ferramentas
    };

    const closeClientModal = () => {
        setClientModalOpen(false); // Fecha o modal de clientes
    };

    const closeToolModal = () => {
        setToolModalOpen(false); // Fecha o modal de ferramentas
    };


    const addItems = (e) => {
        e.preventDefault()


        if (!tool) {
            alert("Selecione um equipamento para a locação!")
            return
        }

        if (!price) {
            alert("Informe o valor da locação!")
            return
        }
        if (!quantity) {
            alert("Informe a quantidade da ferramenta!")
            return
        }

        const parsedPrice = parseFloat(price.replace(/\./g, '').replace(',', '.'));
        const parsedQuantity = parseFloat(quantity)

        const item = {
            toolId: tool.id,
            tool: tool.name,
            quantity: parsedQuantity,
            price: parsedPrice

        }

        setListItems([...listItems, item])
        setTool("")
        setPrice("")
        setQuantity("")


    }

    const handleSelectClient = (client) => {
        setClient(client)
        console.log(client)
        closeClientModal()
        return client
    }

    const handleSelectTool = (tool) => {
        setTool(tool)
        console.log(tool)
        closeToolModal()
        return tool
    }

    const finishRent = async (e) => {
        e.preventDefault()

       

        if (listItems.length == 0) {
            alert("Adicione pelo menos um item à locação!")
            return
        }

        if (initialDate == "") {
            alert("Informe a data inicial da locação!")
            return
        }

        if (listItems.length == 0) {
            alert("Informe a data final da locação!")
            return
        }

        if (!client.name) {
            alert("Selecione o cliente!")
            return
        }

        const updatedListItems = listItems.map(item => {
            // eslint-disable-next-line no-unused-vars
            const { tool, ...rest } = item;  // Desestrutura para remover 'tool'
            return rest;  // Retorna o objeto sem a chave 'tool'
        });

        const dataRentToPdf = {
            client,
            items: listItems,
            price: listItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
            initialDate,
            deliveryDate

        }


        const newRent = {
            client,
            items: updatedListItems,
            price: listItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
            initialDate,
            deliveryDate

        }

        try {

            const request = await api.post("http://localhost:8080/rent/create", newRent)
            console.log(request.data)

            setClient("")
            setTool("")
            setPrice("")
            setQuantity("")
            setInitalDate("")
            setDeliveryDate("")

            navigate("/pdf", { state: dataRentToPdf })

        } catch (error) {
            alert(error.response.data.errors[0])

        }

        console.log(newRent)
    }

    const calculateQuantityOfAndaime = (e) => {

        setMeters(parseFloat((e.target.value)))

        switch (tool.name) {
            case 'Andaime 1,5m':
                setQuantity(Math.ceil((meters / 1.5) * 2));
                break;
            case 'Andaime 2m':
                setQuantity((meters / 2) * 2);
                break;
            case 'Andaime 1m':
                setQuantity(meters * 2);
                break;
            default:
                alert('Tool name not recognized:', tool.name);
        }
    }

    const handleRemoveItem = (index) => {
        const updatedList = listItems.filter((_, i) => i !== index);
        setListItems(updatedList);
    };

    return (

        <>
            <Navbar />
            <section className={styles.sectionContainer}>
                <h1>Alugar</h1>
                <div className={styles.center}>
                    <form className={styles.formContainer} onSubmit={finishRent}>

                        <div className={[styles.inputContainer]}>
                            <label htmlFor="client">Selecione o cliente</label>
                            <input type="text" name="client" id="client" onChange={e => setClient(e.target.value)} value={client.name || ""} disabled />
                            <button onClick={openClients}>Selecionar</button>
                        </div>

                        <div className={styles.inputContainer}>
                            <label htmlFor="tool">Selecione a ferramenta</label>
                            <input type="text" name="tool" id="tool" onChange={e => setTool(e.target.value)} value={tool.name || ""} disabled />
                            <button onClick={openTools}>Selecionar</button>
                        </div>
                        <div className={styles.containerTwoInput}>
                            <div className={styles.inputContainer2}>
                                <label htmlFor="price">Valor da Locação</label>
                                <input type="text" name="price" id="price" onChange={(e) => handlePriceChange(e, setPrice)} value={price} autoComplete='off' placeholder='R$' />
                            </div>
                              {tool.name && tool.name.toLowerCase().includes("andaime") && (
                                <div>
                                    <div className={styles.inputContainer2}>
                                        <label htmlFor="quantity">Metros (m)</label>
                                        <input type="text" name="meters" id="meters" onChange={e => setMeters(e.target.value)} value={meters || ""} autoComplete='off' placeholder='Opcional'/>
                                    </div>
                                    <p className={styles.pCalculate} onClick={calculateQuantityOfAndaime}>Calcular</p>
                                </div>
                            )}
                            <div className={styles.inputContainer2}>
                                <label htmlFor="quantity">Quantidade</label>
                                <input type="text" name="quantity" id="quantity" onChange={e => setQuantity(e.target.value)} value={quantity || ""} autoComplete='off' />
                            </div>
                        </div>
                        <div className={styles.dateInputContainer}>
                            <label htmlFor="initialDate">Data inicial: </label>
                            <input type="date" name="initialDate" id="initialDate" onChange={e => setInitalDate(e.target.value)} value={initialDate} />
                        </div>
                        <div className={styles.dateInputContainer}>
                            <label htmlFor="deliveryDate">Data Final: </label>
                            <input type="date" name="deliveryDate" id="deliveryDate" onChange={e => setDeliveryDate(e.target.value)} value={deliveryDate} />
                        </div>

                        <div className={styles.inputContainer2}>
                            <button onClick={addItems}>Adicionar</button>
                        </div>

                        <div className={styles.inputContainer2}>
                            <input type="submit" value="Alugar" />
                        </div>
                    </form>

                    <div className={styles.listContainer}>
                        <div className={styles.list}>
                            <h2>Items da locação</h2>
                            <ul>
                                {listItems.length > 0 && listItems.map((item, index) => (
                                    <li key={index}><div>{item.tool}</div> <div>{item.quantity}un</div>  <div>R${item.price}</div>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            Remover
                                        </button>


                                    </li>
                                ))}
                            </ul>
                            <p className={styles.total}>
                                TOTAL: R${listItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal para Cliente */}
            <Modal isOpen={isClientModalOpen} onClose={closeClientModal}>
                <h2>Selecione um Cliente</h2>
                {/* Aqui você pode adicionar os componentes ou listagens para clientes */}
                <Table selected={handleSelectClient} />
                <button onClick={closeClientModal}>Fechar</button>
            </Modal>

            {/* Modal para Ferramentas */}
            <Modal isOpen={isToolModalOpen} onClose={closeToolModal}>
                <h2>Selecione uma Ferramenta</h2>
                {/* Aqui você pode adicionar os componentes ou listagens para ferramentas */}
                <TableTools selected={handleSelectTool} />
                <button onClick={closeToolModal}>Fechar</button>
            </Modal>

        </>

    )
}


export default CreateRent