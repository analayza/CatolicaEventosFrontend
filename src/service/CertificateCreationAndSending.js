import Api from "../service/Api.js";

export default async function createAndSendingCertificate(data, token) {
    try {
        const response = await Api.post(`/certificate/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.message;       
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}
