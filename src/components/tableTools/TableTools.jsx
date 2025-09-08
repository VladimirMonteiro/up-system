import api from '../../utils/api';
import styles from '../tableClients/Table.module.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import ConfirmDeleteModal from '../modalConfirmDelete/ConfirmDeleteModal';
import { formateNumber } from '../../utils/formatNumber';
import Loading from '../loading/Loading'
import ComponentMessage from '../componentMessage/ComponentMessage';
import { useNavigate } from 'react-router-dom';


const TableTools = ({ selected, tools, loading, setLoading }) => {
  const [data, setData] = useState(tools || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState([]);
  const [success, setSuccess] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true)
  const rowsPerPage = 13;
  const location = useLocation().pathname;
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);  // Para armazenar o ID da ferramenta
  const [toolName, setToolName] = useState('');  // Para armazenar o nome da ferramenta
  const dynamicId = window.location.pathname

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await api.get("tools");
        setData(response.data);
        setLoadingTable(false)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [tools]);

  const openModal = (e, id, name) => {
    e.preventDefault();
    setToolToDelete(id);  // Salva o ID da ferramenta que será deletada
    setToolName(name);  // Salva o nome da ferramenta
    setOpenModalDelete(true);  // Abre o modal de confirmação
  };

  const handleSearch = (searchTerm) => {
    const filteredData = data.filter((tool) =>
      Object.values(tool).some((value) =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredTools(filteredData);
    setCurrentPage(1);  // Reinicia para a primeira página
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = (filteredTools.length > 0 ? filteredTools : data).slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteTool = async (id) => {
    try {
      const response = await api.delete(`tools/delete/${id}`);
      console.log(response.data);
      setData((prevData) => prevData.filter((tool) => tool.id !== id));
      setOpenModalDelete(false);  // Fecha o modal após a deleção
      setSuccess(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loadingTable ? (<Loading table={true} />) : (
        <div className={styles.tableContainer}>
          {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="search"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className={styles.input}
            />
            <input type="submit" value="Pesquisar" className={styles.button} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Quantidade total</th>
                <th>Quantidade disponível</th>
                <th>Diária</th>
                <th>Semanal</th>
                <th>Quinzena</th>
                <th>3 semanas (21) dias</th>
                <th>Mensal</th>
                {location === "/ferramentas" && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row) => (
                <tr
                  key={row.id}
                  onClick={location === "/alugar" || `/alugar/${dynamicId}` ? () => selected(row) : undefined}

                  style={row.quantity === 0 ? { backgroundColor: '#ffcccc' } : {}}
                >
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.totalQuantity}un</td>
                  <td>{row.quantity}un</td>
                  <td>{formateNumber(row.daily)}</td>
                  <td>{formateNumber(row.week)}</td>
                  <td>{formateNumber(row.biweekly)}</td>
                  <td>{formateNumber(row.twentyOneDays)}</td>
                  <td>{formateNumber(row.priceMonth)}</td>
                  {location === "/ferramentas" && (
                    <td style={{ width: "10%" }}>
                      <MdDelete
                        style={{ color: "red", marginRight: "5px" }}
                        onClick={(e) => openModal(e, row.id, row.name)}  // Passa o ID e nome da ferramenta para o modal
                      />
                      <GrView style={{ marginRight: "5px" }} onClick={() => navigate(`/ferramentas/${row.id}`)} />
                      <FaPen style={{ marginRight: "5px" }} onClick={(e) => selected(e, row.id)} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <ConfirmDeleteModal
            open={openModalDelete}
            onClose={() => setOpenModalDelete(false)}
            itemName={toolName}  // Passa o nome da ferramenta para o modal
            onConfirm={() => handleDeleteTool(toolToDelete)}  // Chama a função de deletar com o ID
            remove={true}
          />
          <div className={styles.pagination}>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TableTools;
