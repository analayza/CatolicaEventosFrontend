import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import logo from '../../assets/logo-catolica.png';
import FormInputComponent from '../../components/FormInputComponent';
import AuthButtonComponent from '../../components/AuthButtonComponent';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import login from '../../service/Login';
import {useAuth} from '../../hooks/UseAuth';

export default function Login() {

    const [erroMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const {loginContext} = useAuth();

    return (
        <>
            <div className='min-h-screen flex flex-col md:flex-row'>
                
                <div style={{ backgroundColor: '#00559C' }} className="md:w-1/5 w-full p-6 flex  items-center justify-center md:justify-start fixed md:relative left-0 top-0 h-20 md:h-screen z-10">
                    <h1 className='text-white font-bold text-xl text-center md:text-left md:text-3xl'>BEM VINDO(A) Á CATÓLICA EVENTOS</h1>
                </div>

                <div className="flex flex-col items-center justify-center flex-grow min-h-screen px-4 md:px-8">
                    <img className="w-40 h-auto mb-4 mx-auto " src={logo} alt='Logo Católica'></img>
                    <h1 style={{ color: '#00559C' }} className='font-bold text-2xl md:text-2xl mb-6 text-center'>Entre na Católica Eventos</h1>
                    <div style={{ boxShadow: "0 6px 7px -3px rgba(0, 0, 0, 0.3)" }} className='border-1 rounded border-gray-200 p-6 w-full md:w-[400px] mx-auto md:h-[375px]' >
                        <Formik initialValues={{
                            email: "",
                            password: ""
                        }} validationSchema={Yup.object({
                            email: Yup.string().required("Obrigatório"),
                            password: Yup.string().required("Obrigatório")
                        })}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const resul = await login(values.email, values.password);
                                    if(resul){
                                        loginContext(resul.token);
                                        return navigate('/');
                                    }
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
                                <div className=' mt-1 ml-2'>
                                    <a href='' arget="_blank" rel="noopener noreferrer" className='underline text-blue-800 font-normal hover:text-blue-900 text-sm'>Esqueci Minha Senha</a>
                                </div>
                                <div className='mt-4 mb-4'>
                                    <AuthButtonComponent
                                        label='Entrar'
                                        className="w-full"
                                    />
                                </div>
                                <div className='flex'>
                                    <p className='font-normal text-sm ml-2'>Não possui Cadastro?</p><Link to="/register" className='underline text-blue-800 font-normal hover:text-blue-900 text-sm ml-1'>
                                        Clique aqui
                                    </Link>
                                </div>
                                {erroMessage && <p className='text-red-700 ml-2'>{erroMessage}</p>}
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}
