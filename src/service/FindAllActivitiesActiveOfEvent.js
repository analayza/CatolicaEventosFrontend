import Api from "./Api.js";

export default async function findAllActivitiesActiveOfEvent(id_event) {
    try {
        const response = await Api.get(`/event/${id_event}/activities/active`, {
            
        });
        console.log("Resposta do backend:", response.data);
        return response.data.activitiesActive;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



