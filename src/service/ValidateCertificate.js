import Api from "./Api.js";

export default async function validateCertificate(codigoValidate) {
    try {
        const response = await Api.get(`/certificate/validation/${codigoValidate}`);
        return response.data.message;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}



