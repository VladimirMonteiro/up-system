import { authContext } from "../context/authProvider/AuthContext";
import { useContext } from "react";

const Protected = ({ children }) => {
    const {token, loading} = useContext(authContext);

    // Exibir um carregamento ou algum tipo de feedback enquanto o estado do token é carregado
    if (loading) {
        return <h1>Carregando...</h1>;
    }

    if (!token) {
        return <h1>Acesso Negado</h1>;
    }

    return <>{children}</>;
};

export default Protected;
