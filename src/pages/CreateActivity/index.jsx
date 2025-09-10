import Menu from "@/components/MenuComponent";
import createActivity from "@/service/CreateActivity";
import ButtonComponent from "@/components/ButtonComponent";
import FormInputComponent from "@/components/FormInputComponent";
import { AuthContext } from "@/context/AuthContext";
import { Formik, Form } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function CreateActivity() {

    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [showMessage, setShowMessage] = useState(null);
    const [message, setMessage] = useState("");
    const {id_event} = useParams();
    const [startDate, setStartDate] = useState(null);


    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [showMessage])
    return (
        <>
            <Menu></Menu>
            <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-blue-50/50">
                <div className="pt-8 pb-4">
                    <h1 className="text-[#005398] md:text-3xl text-[16px] font-bold mt-4 justify-center items-center flex">
                        Preencha os campos e crie sua atividade
                    </h1>
                </div>

                <div className="w-full flex justify-center flex-grow items-center mt-2 px-4 mb-12">
                    <div className="bg-white/60 rounded-2xl shadow-lg border border-white/40 p-8 w-full max-w-4xl">
                        <Formik
                            initialValues={{
                                name: "",
                                description: "",
                                speaker: "",
                                date: null,
                                time: "",
                                slots: "",
                                workload: "",
                                location: "",
                                price: "",
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string()
                                    .min(3, "O nome deve contér no mínimo 3 caracteres")
                                    .max(50, "O nome deve conter no máximo 50 caracteres")
                                    .required("Obrigatório"),
                                description: Yup.string()
                                    .max(500, "A descrição deve conter no máximo 500 caracteres")
                                    .required("Obrigatório"),
                                speaker: Yup.string()
                                    .min(4, 'O nome do palestrante deve ter no mínimo 4 caracteres')
                                    .required('Campo obrigatório'),
                                date: Yup.date()
                                    .nullable()
                                    .required("Obrigatório"),
                                time: Yup.string()
                                    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora inválida (formato HH:MM)')
                                    .required('Campo obrigatório'),
                                slots: Yup.number()
                                    .integer('A quantidade de vagas deve ser um número inteiro')
                                    .positive('A quantidade de vagas Deve ser um número positivo')
                                    .required('Campo obrigatório'),
                                workload: Yup.number()
                                    .positive('A carga horaria deve ser um número positivo')
                                    .required('Campo obrigatório'),
                                location: Yup.string()
                                    .min(3, "O nome deve contér no mínimo 3 caracteres")
                                    .required("Obrigatório"),
                                price: Yup.number()
                                    .min(0, 'O valor não pode ser negativo')
                                    .required('Campo obrigatório'),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                const payload = {
                                    name: values.description,
                                    description: values.description,
                                    speaker: values.speaker,
                                    date: values.date,
                                    time: values.time,
                                    slots: Number(values.slots),
                                    workload: Number(values.workload),
                                    location: values.location,
                                    price: Number(values.price)
                                } 
                                console.log("Submit: ", values);
                                try {
                                    const resul = await createActivity(payload, token, id_event);
                                    console.log(resul);
                                    setShowMessage(true);
                                    setMessage("Atividade Criada com Sucesso!");
                                } catch (error) {
                                    setShowMessage(true);
                                    setMessage(error.message);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                                        <div className="flex flex-col space-y-4">
                                            <FormInputComponent
                                                label="Nome"
                                                name="name"
                                                type="text"
                                                placeholder="Nome da atividade"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Palestrante/Ministrante"
                                                name="speaker"
                                                type="text"
                                                placeholder="Palestrante, Ministrante da atividade"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Horário"
                                                name="time"
                                                type="text"
                                                placeholder="Horário da atividade"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Valor"
                                                name="price"
                                                type="text"
                                                placeholder="Valor da atividade"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Carga Horária"
                                                name="workload"
                                                type="text"
                                                placeholder="Carga horária da atividade"
                                                className="w-full"
                                            />
                                        </div>


                                        <div className="flex flex-col space-y-4">
                                            <FormInputComponent
                                                label="Descrição"
                                                name="description"
                                                type="text"
                                                placeholder="Digite uma descrição para a atividade"
                                                className="w-full"
                                            />
                                            <div>
                                                <label className="block mb-1 text-sm font-normal text-gray-700 ml-1">Data Início</label>
                                                <div className="relative w-52">
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={(date) => {
                                                            setStartDate(date)
                                                            setFieldValue("date", date)
                                                        }}
                                                        minDate={new Date()}
                                                        dateFormat="dd-MM-yyyy"
                                                        placeholderText="Selecione a data de início"
                                                        className="border border-gray-200 w-full h-8 rounded-md placeholder-gray-400 placeholder-opacity-70 placeholder:text-xs px-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                                    /><FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <FormInputComponent
                                                label="Vagas"
                                                name="slots"
                                                type="text"
                                                placeholder="Quantidade de vagas"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Local"
                                                name="location"
                                                type="text"
                                                placeholder="Local onde acontecerá a atividade"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>


                                    <div className="mt-8 md:mr-30 flex justify-center items-center font-semibold md:ml-35">
                                        <ButtonComponent label="Salvar Atividade" color="blue" size="lg" className="px-8 py-3" />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div >
            {message && showMessage && (
                <div className="fixed top-20 right-6 z-50">
                    <div className="bg-white/95 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-4 rounded-2xl shadow-lg max-w-sm">
                        <p className="font-medium">{message}</p>
                    </div>
                </div>
            )
            }
        </>
    )
}