import Api from "./Api.js";

export default async function findActivity(id_activity, token) {
    try {
        const response = await Api.get(`/activity/find/${id_activity}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.activity;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



