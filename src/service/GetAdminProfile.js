import Api from "../service/Api.js";

export default async function getAdminProfile(token) {
    try {
        const response = await Api.get('/admin/find',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
        )
        return response.data.admin;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}