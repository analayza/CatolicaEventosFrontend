import Api from "./Api.js";

export default async function findAllActivitiesOfEvent(id_event) {
    try {
        const response = await Api.get(`/event/${id_event}/activities`);
        return response.data.activities;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



