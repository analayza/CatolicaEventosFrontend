import Api from "../service/Api.js";

export default async function login(email, password) {
    try {
        const response = await Api.post('/auth/login', {
            email: email,
            password: password
        })

        const { token } = response.data;
        return {token};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}