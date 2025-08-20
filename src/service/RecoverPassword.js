import Api from "../service/Api.js";

export default async function recoverPassword(newPassword, token, email) {
    try {
        const response = await Api.put('/auth/reset-password', {
            token, newPassword, email
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
