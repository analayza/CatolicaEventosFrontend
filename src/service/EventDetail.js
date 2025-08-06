import Api from "./Api.js";

export default async function eventDetail(id_event) {
    try {
        const response = await Api.get(`/event/find/${id_event}`);
        return response.data.eventFound;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



