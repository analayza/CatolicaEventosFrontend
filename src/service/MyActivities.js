import Api from "../service/Api.js";

export default async function myActivities(id_event, token) {
    try {
        const response = await Api.get(`/enrollment/${id_event}/my-activitys`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allActivitysUser;       
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}