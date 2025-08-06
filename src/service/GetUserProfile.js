import Api from "../service/Api.js";

export default async function getUserProfile(token) {
    try {
        const response = await Api.get('/user/find',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
        )
        return response.data.user;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}