import Api from "../service/Api.js";

export default async function deleteEvent(token, id_event) {
    try {
        const response = await Api.delete(`/event/delete/${id_event}`, {
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
