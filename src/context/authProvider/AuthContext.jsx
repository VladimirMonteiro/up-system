import { createContext, useState, useEffect } from "react";
import { getUserLocalStorage, loginRequest, setUserLocalStorage } from "./utils";


const authContext = createContext()

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = getUserLocalStorage();

      
        if (userData) {
          setUser(userData);
        }
        setLoading(false); // Após carregar o token, setar loading como false

       
        
      }, []);


      async function authenticate({login, password}) {
        const response = await loginRequest(login, password)
        if(response) {
            console.log(response)

            const payload = {
                token: response.token
            }
            setUser(payload)
            setUserLocalStorage(payload);

        }

           
        return response
      }


      async function logout() {
        setUser(null);
        setUserLocalStorage(null);

      }

    return(
        <authContext.Provider value={{...user, authenticate, loading, logout}}>
            {children}
        </authContext.Provider>
    )
}

export { authContext, AuthProvider };
