import Api from "../service/Api.js";

export default async function createEnrollment(id_activity, token) {
    console.log(token)
    try {
        const response = await Api.post(`/enrollment/${id_activity}`, null, {
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
