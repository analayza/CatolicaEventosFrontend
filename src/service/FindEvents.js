import Api from "./Api.js";

export default async function findAllEvents() {
    try {
        const response = await Api.get('/event/listAll');
        return response.data.allEvents;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



