import Api from "../service/Api.js";

export default async function isUserEnrolled(token, id_activity) {
    try {
        const response = await Api.get(`/enrollment/${id_activity}/status`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
        )
        return response.data.enrollmentExists;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}