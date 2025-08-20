import Api from "../service/Api.js";

export default async function myCertificates(token) {
    try {
        const response = await Api.get(`/certificate/my`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.allCertificates;       
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}