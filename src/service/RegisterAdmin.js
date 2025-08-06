import Api from "../service/Api.js";

export default async function register_admin(name, email, password, course, token) {
    try {
        const response = await Api.post('/auth/register/admin', {
            name: name,
            email: email,
            password: password,
            course: course
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
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