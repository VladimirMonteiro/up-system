import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../../context/authProvider/AuthContext";

const HeaderDefault = () => {
  const auth = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>Up Locações de Equipamentos</h2>
      </div>
      <div>
        <h2 onClick={handleLogout}>Sair</h2>
      </div>
    </div>
  );
};

export default HeaderDefault;
