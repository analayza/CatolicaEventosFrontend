import Api from "./Api.js";

export default async function findAllUsersEnrollmentActivity(id_activity, token) {
    try {
        const response = await Api.get(`/activity/${id_activity}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.allEnrollment;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



