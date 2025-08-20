import Api from "../service/Api.js";

export default async function myEvents(token) {
    try {
        const response = await Api.get(`/enrollment/my-events`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allEventsUser;       
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}