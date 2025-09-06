import styles from './RentPaymentsTable.module.css';
import { useState } from 'react';
import api from '../../utils/api';
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency, formatInputToCurrency, parseCurrencyToFloat } from '../../utils/formatCurrency';
import { MdDelete } from "react-icons/md";
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';

const RentPaymentsTable = ({ payments, setPayments, rentId }) => {
    const [payment, setPayment] = useState("");
    const [datePayment, setDatePayment] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null); // guarda o ID do pagamento

    const handleAddPartialPayment = async (e) => {
        e.preventDefault();

        if (!payment) return alert("Informe o valor do pagamento.");
        if (!datePayment) return alert("Informe a data do pagamento.");

        try {
            const response = await api.post(`rent/partialPayment/${rentId}`, {
                paymentValue: parseCurrencyToFloat(payment),
                datePayment: new Date(datePayment)
            });

            setPayments([...payments, response.data]);
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000);

            setPayment("");
            setDatePayment("");
        } catch (error) {
            console.log(error);
        }
    };

    const handlePaymentChange = (e) => {
        const formatted = formatInputToCurrency(e.target.value);
        setPayment(formatted);
    };

    const openModal = (e, id) => {
        e.preventDefault();
        setPaymentToDelete(id);
        setOpenDeleteModal(true);
    };

    const handleDeletePayment = async () => {
        try {
            const response = await api.delete(`earning/delete/${paymentToDelete}`);
            console.log(response.data);

            setPayments((prev) =>
                prev.filter((payment) => payment.id !== paymentToDelete)
            );

            setOpenDeleteModal(false);
            setPaymentToDelete(null);
            setSuccessMessage("Pagamento excluído com sucesso!");
            setTimeout(() => setSuccessMessage(false), 3000);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h2>Pagamentos referentes à locação</h2>

            <form onSubmit={handleAddPartialPayment} className={styles.formContainer}>
                <input
                    type="text"
                    placeholder="Adicionar pagamento"
                    value={payment}
                    onChange={handlePaymentChange}
                />
                <input
                    type="date"
                    value={datePayment}
                    onChange={e => setDatePayment(e.target.value)}
                />
                <input type="submit" value="Adicionar" />
            </form>

            {successMessage && (
                <div className={styles.successMessage}>
                    {successMessage === true ? "Pagamento cadastrado com sucesso!" : successMessage}
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Valor</th>
                            <th>Data pagamento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment.id || `payment-${index}`}>
                                <td>{payment.id}</td>
                                <td>{formatCurrency(payment.price)}</td>
                                <td>{format(parseISO(payment.date), "dd/MM/yyyy", { locale: ptBR })}</td>
                                <td>
                                    <MdDelete
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={(e) => openModal(e, payment.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                itemName={"o pagamento"}
                onConfirm={handleDeletePayment}
                remove={true}
            />
        </>
    );
};

export default RentPaymentsTable;
