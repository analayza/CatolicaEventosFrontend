import Api from "../service/Api.js";

export default async function disableActivity(token, id_activity) {
    try {
        const response = await Api.patch(`/activity/disable/${id_activity}`, {
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
