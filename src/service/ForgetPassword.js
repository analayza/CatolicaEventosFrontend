import Api from "../service/Api.js";

export default async function forgetPassword(email) {
    try {
        const response = await Api.post('/auth/forgot-password', {
            email: email,
        })
        return response.data.message;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}


