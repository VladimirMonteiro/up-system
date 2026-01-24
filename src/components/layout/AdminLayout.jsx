import styles from './styles.module.css';

import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar.jsx';

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
