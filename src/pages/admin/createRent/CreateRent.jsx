import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handlePriceChange } from '../../../utils/handlePriceChange'


import Navbar from '../../../components/navbar/Navbar'
import Modal from '../../../components/modal/Modal'
import Table from '../../../components/tableClients/Table'
import TableTools from '../../../components/tableTools/TableTools'

import styles from './CreateRent.module.css'
import CompleteRent from '../../../components/completeRent/CompleteRent'
import { formateNumber } from '../../../utils/formatNumber'

const CreateRent = () => {

    const [client, setClient] = useState({})
    const [tool, setTool] = useState("")
    const [price, setPrice] = useState("")
    const [quantity, setQuantity] = useState('')
    const [meters, setMeters] = useState("")
    const [listItems, setListItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingClients, setLoadingClients] = useState(true)

    const [isClientModalOpen, setClientModalOpen] = useState(false); // Estado para o modal de cliente
    const [isToolModalOpen, setToolModalOpen] = useState(false); // Estado para o modal de ferramenta
    const [isFinishRentOpen, setFinishRentOpen] = useState(false)

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

    const modalFinishRent = (e) => {
        e.preventDefault()
        

        if (listItems.length == 0) {
            alert("Adicione pelo menos um item à locação!")
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
        setFinishRentOpen(true)
    }

    const modalFinishRentClose = () => {
        setFinishRentOpen(false)
    }

    const closeClientModal = () => {
        setClientModalOpen(false); // Fecha o modal de clientes
    };

    const closeToolModal = () => {
        setToolModalOpen(false); // Fecha o modal de ferramentas
    };


    const addItems = (e) => {
        e.preventDefault();
    
        if (!tool) {
            alert("Selecione um equipamento para a locação!");
            return;
        }
    
        if (!price) {
            alert("Informe o valor da locação!");
            return;
        }
    
        if (!quantity) {
            alert("Informe a quantidade da ferramenta!");
            return;
        }
    
        let parsedPrice = 0;
    
        if (price.startsWith('R$')) {
            parsedPrice = parseFloat(price.replace('R$', "").replace(/\./g, '').replace(',', '.'));
        } else {
            parsedPrice = parseFloat(price.replace(/\./g, '').replace(',', '.'));
        }
    
        // Verifica se parsedPrice é um número válido
        if (isNaN(parsedPrice)) {
            alert("Preço inválido!");
            return;
        }
    
        const parsedQuantity = parseFloat(quantity);
    
        // Verifica se parsedQuantity é um número válido
        if (isNaN(parsedQuantity)) {
            alert("Quantidade inválida!");
            return;
        }
    
        let itemPrice = parsedPrice;
    
        // Se a ferramenta for um Andaime, multiplicar o preço pelo número de metros
        if (tool.name.startsWith('Andaime') && meters) {
            const parsedMeters = parseFloat(meters);
            itemPrice = parsedPrice * parsedMeters;
        }
    
        const item = {
            toolId: tool.id,
            tool: tool.name,
            quantity: parsedQuantity,
            price: itemPrice,
        };
    
        console.log(item.price);
    
        setListItems([...listItems, item]);
        setTool("");
        setPrice("");
        setQuantity("");
        setMeters(""); // Reseta o campo de metros após a adição
    };
    

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


    const calculateQuantityOfAndaime = (e) => {
        e.preventDefault()

        setMeters(parseFloat(meters))

        switch (tool.name) {
            case 'ANDAIME  1,5m':
                setQuantity(Math.ceil((meters / 1.5) * 2));
                break;
            case 'ANDAIME  2,00 X 1,00':
                setQuantity((meters / 2) * 2);
                break;
            case 'Andaime 1m':
                setQuantity(meters * 2);
                break;
            default:
                alert('Tool name not recognized:', tool.name);
        }

        setMeters('')
    }

    const handleRemoveItem = (index) => {
        const updatedList = listItems.filter((_, i) => i !== index);
        setListItems(updatedList);
    };

    return (

        <section style={{display: 'flex'}}>
            
                <Navbar />
                <section className={styles.sectionContainer}>
                    <h1>Alugar</h1>
                    <div className={styles.center}>
                        <form className={styles.formContainer} onSubmit={modalFinishRent}>
            <div style={{display: "flex", padding: "20px"}}>
            
                                <div className={[styles.inputContainer2]} style={{margin: '10px'}}>
                                    <input type="text" name="client" id="client" onChange={e => setClient(e.target.value)} value={client.name || ""} disabled placeholder='Selecione um cliente'/>
                                    <button onClick={openClients}>Selecionar</button>
                                </div>
                                <div className={styles.inputContainer2} style={{margin: '10px'}}>
                                    <input type="text" name="tool" id="tool" onChange={e => setTool(e.target.value)} value={tool.name || ""} disabled placeholder='Selecione uma ferramenta' />
                                    <button onClick={openTools}>Selecionar</button>
                                </div>
            </div>
                            <div className={styles.containerTwoInput}>
                                <div className={styles.inputContainer2} style={{display: "flex", flexDirection: "row", width:'90%'}}>
                                    <label htmlFor="price">Valor da Locação</label>
                                    <input type="text" name="price" id="price" onChange={(e) => handlePriceChange(e, setPrice)} value={price} autoComplete='off' placeholder='R$' />
                                    <input type="text" name="quantity" id="quantity" onChange={e => setQuantity(e.target.value)} value={quantity || ""} autoComplete='off' placeholder='Quantidade' />
                                    <select name="select" id="select" onChange={e => setPrice(e.target.value)}>
                                        <option value="">Selecione uma opção</option>
                                        {tool && (
                                             <>
                                             <option value={formateNumber(tool.daily)}>Diária (1 dia)</option>
                                             <option value={formateNumber(tool.week)}>Semana (7 dias)</option>
                                             <option value={formateNumber(tool.biweekly)}>Quinzena (15 dias)</option>
                                             <option value={formateNumber(tool.twentyOneDays)}>3 semanas (21 dias)</option>
                                             <option value={formateNumber(tool.priceMonth)}>Mensal (30 dias)</option>
                                             </>
            
                                        )}
                                    </select>
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
                                <div className={styles.inputContainer2} style={{display: "flex", flexDirection: "row", width: "70%"}}>
            
                                </div>
                            </div>
            
                            <div className={styles.inputContainer2} style={{margin: '20px auto'}}>
                                <button onClick={addItems}>Adicionar</button>
                            </div>
                            <div className={styles.inputContainer2} style={{margin: '0 auto'}}>
                                <input type="submit" value="Alugar" />
                            </div>
                        </form>
                        <div className={styles.listContainer}>
                            <div className={styles.list}>
                                <h2>Items da locação</h2>
                                <ul>
                                    {listItems.length > 0 && listItems.map((item, index) => (
                                        <li key={index}><div>{item.tool}</div> <div>{item.quantity}un</div>  <div>{formateNumber(item.price)}</div>
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
                <Modal isOpen={isFinishRentOpen} onClose={modalFinishRentClose} width={'500px'} height={'auto'}>
                    <CompleteRent client={client} tool={tool} price={price} quantity={quantity} listItems={listItems}/>
                </Modal>
                {/* Modal para Cliente */}
                <Modal isOpen={isClientModalOpen} onClose={closeClientModal} height={'90vh'} overflow={"scroll"}>
                    <h2>Selecione um Cliente</h2>
                    {/* Aqui você pode adicionar os componentes ou listagens para clientes */}
                    <Table selected={handleSelectClient} loading={loadingClients} setLoadingClients={setLoadingClients} />
                    <button onClick={closeClientModal}>Fechar</button>
                </Modal>
                {/* Modal para Ferramentas */}
                <Modal isOpen={isToolModalOpen} onClose={closeToolModal} height={"90vh"} overflow={"scroll"}>
                    <h2>Selecione uma Ferramenta</h2>
                    {/* Aqui você pode adicionar os componentes ou listagens para ferramentas */}
                    <TableTools selected={handleSelectTool} loading={loading} setLoading={setLoading} />
                    <button onClick={closeToolModal}>Fechar</button>
                </Modal>
        
        </section>

    )
}


export default CreateRent