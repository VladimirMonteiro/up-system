import { useParams } from 'react-router-dom'
import Loading from '../../../../components/loading/Loading'
import MyMenu from '../../../../components/navbar/Navbar'
import styles from './SingleTool.module.css'

import { useSingleTool } from '../../hooks/useSingleTool'
import ToolHeader from '../../components/ToolHeader'
import ToolInfoCards from '../../components/ToolInfoCards'
import ToolRentsSection from '../../components/ToolRentsSection'

const SingleTool = () => {
  const { id } = useParams()
  const { tool, rents, loading, error } = useSingleTool(id)

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="mainContainerFlex">
        <MyMenu />
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="mainContainerFlex">
      <MyMenu />

      <section className={styles.containerSection}>
        <ToolHeader
          name={tool?.name}
          category={tool?.category}
        />

        <ToolInfoCards
          tool={tool}
          rentsCount={rents.length}
        />

        <ToolRentsSection rents={rents} />
      </section>
    </div>
  )
}

export default SingleTool
