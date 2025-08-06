import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import logo from '../../assets/logo-catolica.png';
import FormInputComponent from '../../components/FormInputComponent';
import AuthButtonComponent from '../../components/AuthButtonComponent';
import { useNavigate } from 'react-router-dom';
import register from '../../service/RegisterUser';
import { useState } from 'react';

export default function RegisterUser() {

    const navigate = useNavigate();
    const [erroMessage, setErrorMessage] = useState("");
    return (
        <>
            <div className='min-h-screen flex flex-col md:flex-row'>
                <div style={{ backgroundColor: '#00559C' }} className="md:w-1/5 w-full p-6 flex  items-center justify-center md:justify-start fixed md:relative left-0 top-0 h-20 md:h-screen z-10">
                    <h1 className='text-white font-bold text-xl text-center md:text-left md:text-3xl'>BEM VINDO(A) Á CATÓLICA EVENTOS</h1>
                </div>

                <div className="flex flex-col items-center justify-center flex-grow min-h-screen px-4 md:px-8">
                    <img className="w-40 h-auto mb-4 mx-auto " src={logo} alt='Logo Católica'></img>
                    <h1 style={{ color: '#00559C' }} className='font-bold text-3xl md:text-3xl mb-6 text-center'>Cadastre-se na Católica Eventos</h1>
                    <div style={{ boxShadow: "0 6px 7px -3px rgba(0, 0, 0, 0.3)" }} className='border-1 rounded border-gray-200 p-6 w-full md:w-[430px] mx-auto md:h-[385px]' >
                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                password: ""
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string()
                                    .min(3, "O nome deve contér no mínimo 3 caracteres")
                                    .max(50, "O nome deve conter no máximo 50 caracteres")
                                    .matches(/^[\p{L}\s]+$/u, "Não pode conter números ou caracteres especiais")
                                    .required("Obrigatório"),
                                email: Yup.string()
                                    .email("Email inválido")
                                    .required("Obrigatório"),
                                password: Yup.string()
                                    .min(6, "A senha deve conter no mínimo 6 caracteres")
                                    .max(20, "A senha deve conter no máximo 20 caracteres")
                                    .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
                                    .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
                                    .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
                                    .matches(/[@$!%*?&]/, 'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)')
                                    .required("Obrigatório")
                            })}

                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const resul = await register(values.name, values.email, values.password);
                                    setSubmitting(false);
                                    if (resul.sucess) {
                                        setErrorMessage('');
                                        console.log("Register sucess: ", values.name, values.email)
                                        return navigate("/login");
                                    } else {
                                        setErrorMessage(resul.error);
                                    }
                                } catch (error) {
                                    console.error("Erro ao registrar:", error.message);
                                }
                            }}
                        >
                            <Form className='space-y-4'>
                                <div className='mt-3 ml-1 mr-1'>
                                    <FormInputComponent
                                        label='Nome'
                                        name="name"
                                        type="text"
                                        placeholder="Nome"
                                        className="w-full"
                                    />
                                </div>

                                <div className='mt-1 ml-1 mr-1'>
                                    <FormInputComponent
                                        label='Email'
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        className="w-full"
                                    />
                                </div>

                                <div className='mt-3 ml-1 mr-1'>
                                    <FormInputComponent
                                        label='Senha'
                                        name="password"
                                        type="password"
                                        placeholder="Senha"
                                        className="w-full"
                                    />
                                </div>

                                <div className='mt-7 mb-4'>
                                    <AuthButtonComponent
                                        label='Cadastre-se'
                                        className="w-full"
                                    />
                                </div>
                                {erroMessage && <p>{erroMessage}</p>}
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}
