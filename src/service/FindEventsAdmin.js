import Api from "./Api.js";

export default async function findAllEventsAdmin(token) {
    try {
        const response = await Api.get('/event/listAllByAdmin', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.allEventsAdmin;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        } else if (error.response) {
            throw new Error(error.response.data.error || "Erro ao buscar eventos");
        } else {
            throw new Error("Erro no servidor. Tente novamente.");
        }
    }
}



