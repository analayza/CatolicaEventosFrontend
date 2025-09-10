import Api from "../service/Api.js";

export default async function createActivity(data, token, id_event) {
    try {
        const response = await Api.post(`/activity/create/${id_event}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;       
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}
