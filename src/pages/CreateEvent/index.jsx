import ButtonComponent from "@/components/ButtonComponent";
import FormInputComponent from "@/components/FormInputComponent";
import Menu from "@/components/MenuComponent";
import UploadImageComponent from "@/components/UploadImageComponent";
import { AuthContext } from "@/context/AuthContext";
import createEvent from "@/service/CreateEvent";
import { Formik, Form } from "formik";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateEvent() {

    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(null);
    const { token } = useContext(AuthContext);
    const [eventPreview, setEventPreview] = useState(null);
    const [certificatePreview, setCertificatePreview] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [showMessage])

    return (
        <>
            <Menu></Menu>
            <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-blue-50/50">
                <div className="pt-8 pb-4">
                    <h1 className="text-[#005398] md:text-3xl text-lg font-bold mt-4 justify-center items-center flex">
                        Preencha os campos e crie seu evento
                    </h1>
                </div>

                <div className="w-full flex justify-center flex-grow items-center mt-2 px-4 mb-12">
                    <div className="bg-white/60 rounded-2xl shadow-lg border border-white/40 p-8 w-full max-w-4xl">
                        <Formik
                            initialValues={{
                                name: "",
                                description: "",
                                start_date: "",
                                end_date: "",
                                location: "",
                                image: null,
                                certificate_background: null,
                                sponsor_pitch: "",
                                minimum_sponsorship_value: "",
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string()
                                    .min(3, "O nome deve contér no mínimo 3 caracteres")
                                    .max(50, "O nome deve conter no máximo 50 caracteres")
                                    .required("Obrigatório"),
                                description: Yup.string()
                                    .max(500, "A descrição deve conter no máximo 500 caracteres")
                                    .required("Obrigatório"),
                                start_date: Yup.date().required("Obrigatório"),
                                end_date: Yup.date().required("Obrigatório"),
                                location: Yup.string().min(3, "O nome deve contér no mínimo 3 caracteres").required("Obrigatório"),
                                image: Yup.mixed()
                                    .nullable()
                                    .notRequired()
                                    .test(
                                        "fileType",
                                        "Apenas Aquivos JPEG, JPG ou PNG são permitidos",
                                        (value) => {
                                            if (!value) return true;
                                            const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
                                            return supportedFormats.includes(value.type);
                                        }
                                    ),
                                certificate_background: Yup.mixed()
                                    .nullable()
                                    .notRequired()
                                    .test(
                                        "fileType",
                                        "Apenas Aquivos JPEG, JPG ou PNG são permitidos",
                                        (value) => {
                                            if (!value) return true;
                                            const supportedFormats = ["image/jpeg", "image/jpg", "image/png"];
                                            return supportedFormats.includes(value.type);
                                        }
                                    ),
                                sponsor_pitch: Yup.string()
                                    .max(500, "A descrição deve conter no máximo 500 caracteres")
                                    .required("Obrigatório"),
                                minimum_sponsorship_value: Yup.number()
                                    .min(0, "O valor do patrocinio deve ser maior que zero")
                                    .required("Obrigatório"),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                const formData = new FormData();
                                console.log("Submit: ", values);
                                if (values.name) formData.append("name", values.name);
                                if (values.description) formData.append("description", values.description);
                                if (values.start_date) formData.append("start_date", values.start_date);
                                if (values.end_date) formData.append("end_date", values.end_date);
                                if (values.location) formData.append("location", values.location);
                                if (values.image) formData.append("image", values.image);
                                if (values.certificate_background) formData.append("certificate_background", values.certificate_background);
                                if (values.sponsor_pitch) formData.append("sponsor_pitch", values.sponsor_pitch);
                                if (values.minimum_sponsorship_value) formData.append("minimum_sponsorship_value", values.minimum_sponsorship_value);


                                try {
                                    const resul = await createEvent(formData, token);
                                    console.log(resul);
                                    setShowMessage(true);
                                    setMessage("Evento Criado com Sucesso!");
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
                                                placeholder="Nome do evento"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Local"
                                                name="location"
                                                type="text"
                                                placeholder="Local do evento"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Descrição do Evento"
                                                name="description"
                                                type="text"
                                                placeholder="Digite uma descrição para o evento"
                                                className="w-full"
                                            />
                                            <UploadImageComponent
                                                id="event_image"
                                                name="image"
                                                label="Carregar a Imagem do Evento"
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    setFieldValue("image", file);
                                                    setEventPreview(file ? URL.createObjectURL(file) : profileDefault);
                                                }}
                                            />
                                            <UploadImageComponent
                                                id="certificate_image"
                                                name="certificate_background"
                                                label="Carregar fundo do Certificado"
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    setFieldValue("certificate_background", file);
                                                    setCertificatePreview(file ? URL.createObjectURL(file) : profileDefault);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-4">
                                            <div>
                                                <label className="block mb-1 text-sm font-normal text-gray-700 ml-1">Data Início</label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => {
                                                        setStartDate(date)
                                                        setFieldValue("start_date", date)
                                                        if (endDate && date && endDate < date) {
                                                            setEndDate(null)
                                                            setFieldValue("end_date", "")
                                                        }
                                                    }}
                                                    minDate={new Date()}
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="Selecione a data de início"
                                                    className="border border-gray-200 w-full h-8 rounded-md placeholder-gray-400 placeholder-opacity-70 placeholder:text-xs px-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-1 text-sm font-normal text-gray-700 ml-1">Data Fim</label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date) => {
                                                        setEndDate(date)
                                                        setFieldValue("end_date", date)
                                                    }}
                                                    minDate={startDate || new Date()}
                                                    dateFormat="yyyy-MM-dd"
                                                    placeholderText="Selecione a data de fim"
                                                    className="border border-gray-200 w-full h-8 rounded-md placeholder-gray-400 placeholder-opacity-70 placeholder:text-xs px-2 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                                />
                                            </div>

                                            <FormInputComponent
                                                label="Descrição para Patrocinadores"
                                                name="sponsor_pitch"
                                                type="text"
                                                placeholder="Digite uma descrição do evento para os patrocinadores"
                                                className="w-full"
                                            />
                                            <FormInputComponent
                                                label="Valor do Patrocinio"
                                                name="minimum_sponsorship_value"
                                                type="text"
                                                placeholder="Valor do Patrocinio para o evento"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>


                                    <div className="mt-8 md:mr-30 flex justify-center items-center font-semibold">
                                        <ButtonComponent label="Salvar Evento" color="blue" size="lg" className="px-8 py-3" />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            {message && showMessage && (
                <div className="fixed top-20 right-6 z-50">
                    <div className="bg-white/95 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-4 rounded-2xl shadow-lg max-w-sm">
                        <p className="font-medium">{message}</p>
                    </div>
                </div>
            )}
        </>
    )
}