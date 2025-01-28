import api from '../../utils/api'
export function setUserLocalStorage(user) {
  localStorage.setItem("u", JSON.stringify(user));
}

export function getUserLocalStorage() {
  const json = localStorage.getItem("u");

  if (!json) {
    return null
  };

  const user = JSON.parse(json);


  if (user && user.token) {
    api.defaults.headers.common["Authorization"] = user.token;
  }

  return user

}

export async function loginRequest(login, password) {
 
    try {
      // Envia a requisição POST para o backend
      const response = await api.post("auth/login", {
        login,
        password,
      });


      // Se a requisição for bem-sucedida, o código abaixo será executado
      console.log("Resposta do servidor:", response.data);

      return response.data
    } catch (error) {
      // Caso ocorra algum erro durante a requisição, ele será capturado aqui
     return error
    }
  };
