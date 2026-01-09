import styles from '../pages/SingleTool/SingleTool.module.css'

const ToolInfoCards = ({ tool, rentsCount }) => (
  <div className={styles.infoCards}>
    <div className={styles.card}>
      <h3>Quantidade Disponível</h3>
      <p>{tool.quantity ?? 0}</p>
    </div>

    <div className={styles.card}>
      <h3>Preço Diário</h3>
      <p>R$ {tool.daily ?? '0,00'}</p>
    </div>

    <div className={styles.card}>
      <h3>Status</h3>
      <p>{tool.status || 'Indefinido'}</p>
    </div>

    <div className={styles.card}>
      <h3>Total de Aluguéis</h3>
      <p>{rentsCount}</p>
    </div>
  </div>
)

export default ToolInfoCards
