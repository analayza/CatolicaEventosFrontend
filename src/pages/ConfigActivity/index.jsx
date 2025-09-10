import Menu from "@/components/MenuComponent";
import ButtonComponent from "../../components/ButtonComponent"
import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import findActivity from "@/service/FindActivity";
import findAllUsersEnrollmentActivity from "@/service/FindAllUsersEnrollmentActivity";
import { FaEdit, FaLock, FaTrash, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign, FaUsers, FaInfoCircle, FaMicrophone, FaUser, FaCheckCircle, FaRegCircle, } from "react-icons/fa"
import createAndSendingCertificate from "@/service/CertificateCreationAndSending";
import deleteActivity from "@/service/DeleteActivity";

export default function ConfigActivity() {

    const [activity, setActivity] = useState(null);
    const { token } = useContext(AuthContext);
    const { id_activity } = useParams();
    const [allEnrollmentActivity, setAllEnrollmentActivity] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(null);
    const [openDeleteActivity, setOpenDeleteActivity] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        async function loadActivity() {
            try {
                const activityData = await findActivity(id_activity, token);
                setActivity(activityData);
            } catch (error) {
                console.error("Erro ao carregar eventos: ", error)
            }
        }
        if (id_activity) {
            loadActivity();
        }
    }, [id_activity])


    useEffect(() => {
        async function loadAllEnrollmentActivity() {
            try {
                const enrollmentActivity = await findAllUsersEnrollmentActivity(id_activity, token);
                setAllEnrollmentActivity(enrollmentActivity);
            } catch (error) {
                console.error("Erro ao carregar eventos: ", error)
            }
        }
        if (id_activity) {
            loadAllEnrollmentActivity();
        }
    }, [id_activity])


    function formateDate(isoDate) {
        const data = new Date(isoDate)
        return data.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const toggleparticipant = (participant_id) => {
        if (selectedParticipants.includes(participant_id)) {
            setSelectedParticipants(selectedParticipants.filter((id) => id !== participant_id));
        } else {
            setSelectedParticipants([...selectedParticipants, participant_id]);
        }
    };

    const toggleAll = () => {
        if (selectedParticipants.length === allEnrollmentActivity.length) {
            setSelectedParticipants([]);
        } else {
            setSelectedParticipants(allEnrollmentActivity.map((user) => user.id_enrollment));
        }
    };

    async function handleAllParticipants(participants, token) {
        if (participants.length === 0) {
            setMessage("Selecione pelo menos um participante");
            setShowMessage(true);
            return;
        }
        try {
            const sendingCertificates = await createAndSendingCertificate({ enrollments: participants }, token);
            setMessage(sendingCertificates);
            setShowMessage(true);
            setTimeout(() => {
                setSelectedParticipants([]);
            }, 2000)

        } catch (error) {
            setMessage(error.message || "Erro ao enviar certificados.");
            setShowMessage(true);
            console.error(error);
        }
    }

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000);
            return () => clearTimeout(timer)
        }
    }, [showMessage])


    function toggleActivity() {
        if (openDeleteActivity) {
            setOpenDeleteActivity(false);
        } else {
            setOpenDeleteActivity(true);
        }
    }
    async function handleDeleteActivity(id_activity) {
        try {
            await deleteActivity(id_activity, token);
            setMessage("Atividade deletada com sucesso!");
            setShowMessage(true);
            const timer = setTimeout(() => {
                navigate("/");
            }, 3000)
            return () => clearTimeout(timer)
        } catch (error) {
            setMessage(error.message || "Erro ao deletar o evento.");
            setShowMessage(true);
            console.error("Erro ao deletar o evento: ", error)
        }
    }

    function handleUpdateActivity(){
        navigate(`/activity/update/${id_activity}`);
    }

    return (
        <>
            <Menu></Menu>
            {activity ? (
                <div>
                    <div>
                        <div className="mb-6 mt-8">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Informações da Atividade</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto px-4 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                                    <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Nome da Atividade</h3>
                                        <p className="text-gray-800 font-medium">{activity.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl">
                                    <FaMicrophone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Palestrante</h3>
                                        <p className="text-gray-800 font-medium">{activity.speaker}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl">
                                    <FaCalendarAlt className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Data</h3>
                                        <p className="text-gray-800 font-medium">{formateDate(activity.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl">
                                    <FaClock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Horário</h3>
                                        <p className="text-gray-800 font-medium">{activity.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl">
                                    <FaMapMarkerAlt className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Local</h3>
                                        <p className="text-gray-800 font-medium">{activity.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-xl">
                                    <FaDollarSign className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Preço</h3>
                                        <p className="text-gray-800 font-medium">{activity.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-xl">
                                    <FaUsers className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Vagas</h3>
                                        <p className="text-gray-800 font-medium">{activity.workload}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100/50 rounded-xl">
                                    <FaInfoCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-gray-700 text-sm mb-1">Status da Atividade</h3>
                                        <p className="text-gray-800 font-medium">{activity.status}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl">
                                <div className="flex items-start space-x-3">
                                    <FaInfoCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-700 text-sm mb-2">Descrição</h3>
                                        <p className="text-gray-800 leading-relaxed">{activity.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col ">
                        <div className="mb-6 mt-4">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Configure sua Atividade</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="md:flex md:flex-row grid-cols-2 grid items-center md:not-last:items-center justify-center mb-6 gap-1">
                            <div className="flex items-center gap-4 ml-2">
                                <ButtonComponent
                                    label="Editar"
                                    size="w-35 h-10"
                                    color="greenwater"
                                    onClick={handleUpdateActivity}
                                >
                                    <FaEdit className="mb-1 mr-1"></FaEdit> Editar
                                </ButtonComponent>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <ButtonComponent
                                    label="Excluir"
                                    size="w-35 h-10"
                                    color="red"
                                    onClick={toggleActivity}
                                >
                                    <FaTrash className="mb-1 mr-1"></FaTrash> Excluir
                                </ButtonComponent>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                                <ButtonComponent
                                    label="Desativar"
                                    size="h-10"
                                    color="purple"
                                >
                                    <FaLock className="mb-1 mr-1"></FaLock> Desativar
                                </ButtonComponent>
                            </div>
                        </div>
                    </div>

                    {openDeleteActivity && (
                        <>
                            <div
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                                onClick={() => setOpenDeleteActivity(null)}
                            />
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 max-w-lg w-[90%] max-h-[80vh] overflow-auto border border-gray-100">
                                <div className="flex justify-between items-start mb-1 ml-5">
                                    <div className="flex flex-col items-center justify-center">
                                        <h3 className="mb-2"><strong>Tem certeza que deseja excluir essa atividade?</strong></h3>
                                        <div className="flex flex-row gap-2">
                                            <ButtonComponent
                                                label="Sim"
                                                onClick={() => handleDeleteActivity(id_activity)}
                                            />
                                            <ButtonComponent
                                                label="Não"
                                                color="red"
                                                onClick={() => setOpenDeleteActivity(false)}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpenDeleteActivity(null)}
                                        className="p-0 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Fechar modal"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </>

                    )}
                    <div>
                        <div className="mb-6 mt-4">
                            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Lista de Participantes</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto px-4 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-6">
                            <div className="mb-6 text-center">
                                <p className="text-gray-600 text-lg font-medium">Envie os certificados aos participantes</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Selecione os participantes que devem receber seus certificados
                                </p>
                            </div>

                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedParticipants.length === allEnrollmentActivity.length &&
                                                allEnrollmentActivity.length > 0
                                            }
                                            onChange={toggleAll}
                                            className="sr-only"
                                        />
                                        {selectedParticipants.length === allEnrollmentActivity.length &&
                                            allEnrollmentActivity.length > 0 ? (
                                            <FaCheckCircle className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <FaRegCircle className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <FaUsers className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-gray-700">Selecionar Todos os Participantes</span>
                                </label>
                            </div>

                            {allEnrollmentActivity && allEnrollmentActivity.length > 0 ? (
                                <div className="grid gap-3">
                                    {allEnrollmentActivity.map((user) => (
                                        <div
                                            key={user.id_user}
                                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 cursor-pointer"
                                            onClick={() => toggleparticipant(user.id_enrollment)}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedParticipants.includes(user.id_enrollment)}
                                                    onChange={() => toggleparticipant(user.id_enrollment)}
                                                    className="sr-only"
                                                />
                                                {selectedParticipants.includes(user.id_enrollment) ? (
                                                    <FaCheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <FaRegCircle className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <FaUser className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                            <span className="font-medium text-gray-800 flex-1">{user.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-8">
                                        <FaUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 text-lg font-medium">
                                            Nenhum participante cadastrado nessa atividade.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {allEnrollmentActivity.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex justify-center">
                                        <ButtonComponent
                                            label="Enviar Certificados"
                                            size="md:w-56 md:h-10"
                                            onClick={() => handleAllParticipants(selectedParticipants, token)}
                                            color="blue"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            ) : (

                <div></div>
            )}


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