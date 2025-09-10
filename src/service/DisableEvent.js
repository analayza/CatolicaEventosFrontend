import Api from "./Api.js";

export default async function disableEvent(id_event, token) {
    try {
        const response = await Api.patch(`/event/disable/${id_event}`, 
            {

            },
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data.eventDesible.status;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}