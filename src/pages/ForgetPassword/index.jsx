import forgetPassword from '../../service/ForgetPassword';
import logo from '../../assets/logo-catolica.png';
import ImageReset from '../../assets/password-reset.png';
import FormInputComponent from "../../components/FormInputComponent";
import { Formik, Form } from 'formik';
import AuthButtonComponent from '../../components/AuthButtonComponent';
import * as Yup from 'yup';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import recoverPassword from '../../service/RecoverPassword';


export default function ForgetPassword() {

    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");

    return (
        <>

            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100/50">
                <div className="flex px-4 md:px-8 py-4 items-center">
                    <div className="flex items-center">
                        <img className="md:w-40 w-32 h-auto" src={logo} alt="Logo Católica" />
                        <div className="ml-4">
                            <p className="md:text-4xl text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                Católica Eventos
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {step === 1 && (

                <div className="border rounded border-[#dddddd] p-6 mt-12  w-[90%] md:w-[390px] mx-auto md:h-[380px]">
                    <div className="flex justify-center">
                        <img className="md:w-40 md:h-40 w-35 h-30 -mt-4" src={ImageReset} alt="Imagem Validação" />
                    </div>
                    <p className="text-[#00549B] font-extrabold md:text-2xl text-center">Recuperar Senha</p>
                    <h3 className='items-center flex justify-center mt-4'>Digite o seu email</h3>
                    <Formik initialValues={{
                        email: ""
                    }} validationSchema={Yup.object({
                        email: Yup.string().required("Obrigatório")
                    })}

                        onSubmit={async (values, { setSubmitting }) => {

                            try {
                                const resul = await forgetPassword(values.email);
                                setMessage(resul);
                                setEmail(values.email);
                                setStep(2);
                                setTimeout(() => {
                                    setMessage("");
                                }, 3000);

                            } catch (error) {
                                setMessage(error.message);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        <Form>
                            <div className="mt-4">
                                <FormInputComponent
                                    name="email"
                                    type="email"
                                    placeholder="Digite o email da sua conta"
                                    className="w-full"
                                ></FormInputComponent>
                            </div>
                            <div className="mt-4">
                                <AuthButtonComponent
                                    label="Enviar Email"
                                ></AuthButtonComponent>
                            </div>
                        </Form>
                    </Formik>

                </div>
            )}

            {step === 2 && (
                <>
                    <div className="border rounded border-[#dddddd] p-6 mt-20  w-[90%] md:w-[390px] mx-auto md:h-[250px]">
                        <p className="text-[#00549B] font-extrabold md:text-2xl text-center">Redefinição de Senha</p>
                        <h3 className='items-center flex justify-center mt-4'>Digite o código enviado no email.</h3>
                        <Formik initialValues={{
                            token: ""
                        }} validationSchema={Yup.object({
                            token: Yup.string().required("Obrigatório")
                        })}

                            onSubmit={(values) => {
                                setToken(values.token);
                                setStep(3);
                            }}

                        >
                            <Form>
                                <div className="mt-4">
                                    <FormInputComponent
                                        name="token"
                                        type="text"
                                        placeholder="Digite o código"
                                        className="w-full"
                                    ></FormInputComponent>
                                </div>
                                <div className="mt-4">
                                    <AuthButtonComponent
                                        label="Enviar Código"
                                    ></AuthButtonComponent>
                                </div>
                            </Form>
                        </Formik>

                    </div>
                </>
            )}

            {step === 3 && (
                <div className="border rounded border-[#dddddd] p-6 mt-12  w-[90%] md:w-[390px] mx-auto md:h-[380px]">
                    {/* <div className="flex justify-center">
                                <img className="md:w-40 md:h-40 w-35 h-35 -mt-4" src={ImageReset} alt="Imagem Validação" />
                            </div> */}
                    <p className="text-[#00549B] font-extrabold md:text-2xl text-center">Redefinição de Senha</p>
                    <h3 className='items-center flex justify-center mt-4'>Digite sua nova senha.</h3>
                    <Formik initialValues={{
                        newPassword: ""
                    }} validationSchema={Yup.object({
                        newPassword: Yup.string().required("Obrigatório")
                    })}

                        onSubmit={async (values, { setSubmitting }) => {

                            try {
                                console.log("Email:", email);
                                console.log("Token:", token);
                                const resul = await recoverPassword(values.newPassword, token, email);
                                setMessage(resul + " Agora pode efetuar Login!");
                                setTimeout(() => {
                                    navigate("/login")
                                }, 5000);

                            } catch (error) {
                                setMessage("Código Inválido ou expirado. Não foi possivél alterar a senha. Repita o processo e tente novamente.");
                                setTimeout(() => {
                                    setMessage("");
                                }, 5000);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        <Form>
                            <div className="mt-4">
                                <FormInputComponent
                                    name="newPassword"
                                    type="password"
                                    placeholder="Digite sua nova senha"
                                    className="w-full"
                                ></FormInputComponent>
                            </div>
                            <div className="mt-4">
                                <AuthButtonComponent
                                    label="Salvar Senha"
                                ></AuthButtonComponent>
                            </div>
                        </Form>
                    </Formik>

                </div>
            )}


            {message === "E-mail de recuperação enviado com sucesso." || message === "Senha redefinida com sucesso. Agora pode efetuar Login!" ? (
                <p className="text-green-600 mt-3 md:text-base text-sm text-center font-semibold">{message}</p>
            ) : (
                <p className="text-red-600 mt-3 text-center font-semibold">{message}</p>
            )}
        </>
    )
}