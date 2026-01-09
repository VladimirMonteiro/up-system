import styles from '../pages/SingleTool/SingleTool.module.css'

const ToolHeader = ({ name, category }) => (
  <div className={styles.headerSection}>
    <h1>{name}</h1>
    <p className={styles.category}>
      {category || 'Categoria não definida'}
    </p>
  </div>
)

export default ToolHeader
