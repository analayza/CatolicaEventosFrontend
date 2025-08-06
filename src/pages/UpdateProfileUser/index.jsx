import MenuUser from "../../components/MenuUserComponent";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInputComponent from '../../components/FormInputComponent';
import ButtonComponent from "../../components/ButtonComponent";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import profileDefault from '../../assets/profile.png';
import getUserProfile from "../../service/GetUserProfile";
import updateProfileUser from "../../service/UpdateProfileUser";
import UploadImageComponent from "../../components/UploadImageComponent";

export default function UpdateProfileUser() {

    const [profilePic, setProfilePic] = useState(null);
    const [message, setMessage] = useState("");
    const { token } = useContext(AuthContext);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const userData = await getUserProfile(token);
                if (userData.profile_picture) {
                    setProfilePic(userData.profile_picture);
                } else {
                    setProfilePic(profileDefault);
                }
            } catch (error) {
                setProfilePic(profileDefault);
            }
        }
        fetchProfile();
    }, [token]);

    return (
        <>
            <MenuUser></MenuUser>
            <div className="flex flex-col items-center justify-center flex-grow px-4 md:px-8 pt-3 md:pt-6">
                <h1 style={{ color: '#00559C' }} className='font-bold text-2xl md:text-3xl text-center'>Conta</h1>
                <div className="w-full flex items-center justify-center flex-grow">
                    <Formik initialValues={{
                        name: "",
                        email: "",
                        oldPassword: "",
                        newPassword: "",
                        profile_picture: null
                    }} validationSchema={Yup.object({
                        name: Yup.string()
                            .min(3, "O nome deve contér no mínimo 3 caracteres")
                            .max(50, "O nome deve conter no máximo 50 caracteres")
                            .matches(/^[\p{L}\s]+$/u, "Não pode conter números ou caracteres especiais"),
                        email: Yup.string()
                            .email("Email inválido"),
                        oldPassword: Yup.string()
                            .min(6, "A senha deve conter no mínimo 6 caracteres")
                            .max(20, "A senha deve conter no máximo 20 caracteres")
                            .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
                            .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
                            .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
                            .matches(/[@$!%*?&]/, 'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)'),
                        newPassword: Yup.string()
                            .min(6, "A senha deve conter no mínimo 6 caracteres")
                            .max(20, "A senha deve conter no máximo 20 caracteres")
                            .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
                            .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
                            .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
                            .matches(/[@$!%*?&]/, 'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)'),
                        profile_picture: Yup.mixed()
                            .test(
                                "fileType",
                                "Apenas Aquivos JPEG, JPG ou PNG são permitidos",
                                (value) => {
                                    if (!value) return true;
                                    const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
                                    return supportedFormats.includes(value.type);
                                }
                            )
                    })}
                        onSubmit={async (values, { setSubmitting }) => {
                            const formData = new FormData();
                            console.log("Submit chamando com valores: " , values);
                            if (values.name) formData.append("name", values.name);
                            if (values.email) formData.append("email", values.email);
                            if (values.oldPassword) formData.append("oldPassword", values.oldPassword);
                            if (values.newPassword) formData.append("newPassword", values.newPassword);
                            if (values.profile_picture) formData.append("profile_picture", values.profile_picture);

                            try {
                                setMessage("Dados Atualizados");
                                const resul = await updateProfileUser(formData, token);
                                console.log(resul);
                                if (resul.updatedData.profile_picture) {
                                    setProfilePic(resul.updatedData.profile_picture);
                                }
                                setMessage("");
                            } catch (error) {
                                setMessage(error.message);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ setFieldValue, isSubmitting }) => (

                            <Form className='space-y-4 w-full max-w-md'>
                                <p className="md:mr-45 mb-1">Foto de Perfil</p>
                                <div className="flex flex-row md:gap-50 gap-23 items-center mb-1">
                                    <div className="flex flex-col">
                                        <div>
                                            <img src={profilePic || profileDefault}
                                                alt="Foto de Perfil" className="w-16 h-16 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <UploadImageComponent
                                            label="Anexar uma foto"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                setFieldValue("profile_picture", file);
                                                setFileName(file ? URL.createObjectURL(file) : profileDefault);
                                            }}
                                        ></UploadImageComponent>
                                    </div>
                                </div>
                                <div className='mt-1 ml-1 mr-1 w-full'>
                                    <FormInputComponent
                                        label='Nome'
                                        name="name"
                                        type="text"
                                        placeholder="Nome"
                                        className="w-full"
                                    />
                                </div>
                                <div className='mt-1 ml-1 mr-1 w-full'>
                                    <FormInputComponent
                                        label='Email'
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        className="w-full"
                                    />
                                </div>
                                <div className='ml-1 -mb-[10px]'>
                                    <button className="ml-62 md:ml-85 text-sm md:text-base text-blue-900 hover:underline">Nova Senha</button>
                                </div>
                                <div className='ml-1 mr-1 w-full'>
                                    <FormInputComponent
                                        label='Senha Antiga'
                                        name="oldPassword"
                                        type="password"
                                        placeholder="Senha antiga"
                                        className="w-full"
                                    />
                                </div>
                                <div className='mt-3 ml-1 mr-1 w-full'>
                                    <FormInputComponent
                                        label='Senha Nova'
                                        name="newPassword"
                                        type="password"
                                        placeholder="Senha nova"
                                        className="w-full"
                                    />
                                </div>
                                <div className='mt-4 mb-4 flex items-center justify-center md:mr-30'>
                                    <ButtonComponent
                                        label="Salvar"
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}