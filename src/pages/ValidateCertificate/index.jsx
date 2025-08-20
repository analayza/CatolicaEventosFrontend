import validateCertificate from "../../service/ValidateCertificate";
import logo from '../../assets/logo-catolica.png';
import ImageValidate from '../../assets/validate.png';
import FormInputComponent from "../../components/FormInputComponent";
import { Formik, Form } from 'formik';
import AuthButtonComponent from '../../components/AuthButtonComponent';
import * as Yup from 'yup';
import { useState } from "react";


export default function ValidateCertificate() {

    const [message, setMessage] = useState("");
    return (
        <>
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100/50">
                <div className="flex px-4 md:px-8 py-4 items-center">
                    <div className="flex items-center">
                        <img className="md:w-40 w-32 h-auto" src={logo || "/placeholder.svg"} alt="Logo Católica" />
                        <div className="ml-4">
                            <p className="md:text-4xl text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                Católica Eventos
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="border rounded border-[#dddddd] p-6 mt-12  w-[90%] md:w-[400px] mx-auto md:h-[385px]">
                <div className="flex justify-center">
                    <img className="md:w-60 md:h-45 w-50 h-35 -mt-6" src={ImageValidate} alt="Imagem Validação" />
                </div>
                <p className="text-[#00549B] font-extrabold md:text-2xl text-center">Autenticação do Documento</p>
                <Formik initialValues={{
                    codigoValidate: ""
                }} validationSchema={Yup.object({
                    codigoValidate: Yup.string().required("Obrigatório")
                })}

                    onSubmit={async (values, { setSubmitting }) => {

                        try {
                            const resul = await validateCertificate(values.codigoValidate);
                            setMessage(resul);
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
                                name="codigoValidate"
                                type="text"
                                placeholder="Digite o Código do Certificado"
                                className="w-full"
                            ></FormInputComponent>
                        </div>
                        <div className="mt-4">
                            <AuthButtonComponent
                                label="Verificar"
                            ></AuthButtonComponent>
                        </div>
                    </Form>
                </Formik>

            </div>
            {message === "Certificado válido." ? (
                <p className="text-green-600 mt-3 text-center font-semibold">{message}</p>
            ) : (
                <p className="text-red-600 mt-3 text-center font-semibold">{message}</p>
            )}
        </>
    )
}