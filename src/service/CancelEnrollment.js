import Api from "../service/Api.js";

export default async function cancelEnrollment(id_activity, token) {
    try {
        const response = await Api.delete(`/enrollment/${id_activity}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.cancelEnrollment;       
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}
