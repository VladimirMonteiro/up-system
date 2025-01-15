import Navbar from "../../../components/navbar/Navbar"
import styles from './Earning.module.css'


import EarningTable from "../../../components/earningTable/EarningTable"
import CreateEarning from "../../../components/createEarning/CreateEarning"

const Earnings = () => {
    return (
        <>
            <Navbar />
            <section className={styles.containerSection}>
                <h1>Faturamentos</h1>
                <div className={styles.components}>
                <CreateEarning/>
                <EarningTable/>
                </div>
              
            </section>


        </>
    )
}

export default Earnings