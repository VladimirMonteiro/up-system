import RentsTable from '../../../components/rentsTable/RentsTable'
import styles from '../pages/SingleTool/SingleTool.module.css'

const ToolRentsSection = ({ rents }) => (
  <div className={styles.tableSection}>
    <h2>Locações que possuem este equipamento</h2>
    <RentsTable rents={rents} />
  </div>
)

export default ToolRentsSection
