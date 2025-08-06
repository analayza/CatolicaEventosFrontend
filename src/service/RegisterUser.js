import Api from "./Api.js";

export default async function register(name, email, password) {
    try {
        const response = await Api.post('/auth/register/user', {
            name: name,
            email: email,
            password: password
        });
        return { sucess: true, data: response.data }
    } catch (error) {
        return { sucess: false, error: error.response?.data.error || "Erro inesperado" };
    }
}