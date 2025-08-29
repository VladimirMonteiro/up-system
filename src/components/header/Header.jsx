import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../../context/authProvider/AuthContext";
import { FiLogOut, FiUser } from "react-icons/fi";

const HeaderDefault = () => {
  const auth = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>
          <span className={styles.highlight}>Up</span> Locações de Equipamentos
        </h1>
      </div>

      <nav className={styles.nav}>
       <button className={styles.iconButton}>
         
        </button>

        <div className={styles.profile}>
          <FiUser className={styles.profileIcon} />
          <span className={styles.profileName}>Administrador</span>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut /> Sair
        </button>
      </nav>
    </header>
  );
};

export default HeaderDefault;
