import Api from "../service/Api.js";

export default async function updateProfileUser(formData, token) {
    try {
        const response = await Api.patch('/user/update', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
        )
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}