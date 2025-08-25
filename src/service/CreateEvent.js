import Api from "../service/Api.js";

export default async function createEvent(formData, token) {
    try {
        const response = await Api.post(`/event/create`, formData, {
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
