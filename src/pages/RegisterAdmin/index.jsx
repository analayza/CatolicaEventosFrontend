import Menu from "../../components/MenuComponent";
import { Formik, Form, Field,ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormInputComponent from '../../components/FormInputComponent';
import AuthButtonComponent from '../../components/AuthButtonComponent';
import register_admin from "../../service/RegisterAdmin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function RegisterAdmin() {
    const navigate = useNavigate();
    const [erroMessage, setErrorMessage] = useState("");
    const {token} = useContext(AuthContext);

    return (
        <>
            <Menu></Menu>
            <div className="flex flex-col items-center justify-center flex-grow px-4 md:px-8 pb-4 pt-10">
                <h1 style={{ color: '#00559C' }} className='font-bold text-2xl md:text-3xl mb-6 text-center'>Cadastrar Administrador</h1>
                <div style={{ boxShadow: "0 6px 7px -3px rgba(0, 0, 0, 0.3)" }} className='border-1 rounded border-gray-200 p-6 w-full md:w-[400px] mx-auto' >
                    <Formik initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        course: ""
                    }} validationSchema={Yup.object({
                        name: Yup.string()
                            .min(3, "O nome deve contér no mínimo 3 caracteres")
                            .max(50, "O nome deve conter no máximo 50 caracteres")
                            .matches(/^[A-Za-z\s]+$/, "Não pode conter números")
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
                            .required("Obrigatório"),
                        course: Yup.string().required("Selecione uma opção")
                    })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                await register_admin(values.name, values.email, values.password, values.course, token);
                                console.log("Administrador registrado com sucesso! ")
                                return navigate('/');
                            } catch (error) {
                                setErrorMessage(error.message);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        <Form className='space-y-4'>
                            <div className='mt-1 ml-1 mr-1'>
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
                            <div className='mt-3 ml-1 mr-1'>
                                <label className="block mb-1 text-sm font-normal text-gray-700 ml-1 ">Curso</label>
                                <Field as="select" name="course" className='border border-gray-200 w-full h-8 rounded-md placeholder-gray-400 px-2 focus:outline-none focus:ring-1 focus:ring-gray-200 text-sm text-gray-900'>
                                    <option value="">Selecione um curso</option>
                                    <option value="Ciências da Computação">Ciências da Computação</option>
                                    <option value="Direito">Direto</option>
                                    <option value="Educação Física">Educação Física</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Filosofia">Filosofia</option>
                                </Field>
                                <ErrorMessage name="course" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className='mt-4 mb-4'>
                                <AuthButtonComponent
                                    label='Entrar'
                                    className="w-full"
                                />
                            </div>
                            {erroMessage && <p>{erroMessage}</p>}
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
}
