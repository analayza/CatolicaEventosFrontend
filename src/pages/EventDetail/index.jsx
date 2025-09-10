import logo from "../../assets/logo-catolica.png"
import eventDetail from "../../service/EventDetail"
import ButtonComponent from "../../components/ButtonComponent"
import { useState, useEffect, useContext, cache } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import MenuUser from "../../components/MenuUserComponent"
import Menu from "../../components/MenuComponent"
import { FaCheck, FaInfoCircle, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign, FaLock, FaUnderline } from "react-icons/fa"
import findAllActivitiesOfEvent from "../../service/FindAllActivitiesOfEvent"
import createEnrollment from "../../service/CreateEnrollment"
import { FaCog } from 'react-icons/fa';
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import deleteEvent from "@/service/DeleteEvent"
import disableEvent from "@/service/DisableEvent"
import findAllActivitiesActiveOfEvent from "@/service/FindAllActivitiesActiveOfEvent"
import isUserEnrolled from "@/service/IsUserEnrolled"


export default function EventDetail() {
    const navigate = useNavigate()
    const { id_event } = useParams()
    const { role, isAuthenticated, token } = useContext(AuthContext)

    const [event, setEvent] = useState(null)
    const [activitiesActive, setActivitiesActive] = useState([])
    const [activities, setActivities] = useState([])
    const [openActivity, setOpenActivity] = useState(null)
    const [message, setMessage] = useState("")
    const [showMessage, setShowMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [openDeleteEvent, setOpenDeleteEvent] = useState(null)
    const [UserEnrolled, setUserEnrolled] = useState({})
    const activitiesToShow = isAuthenticated && role === "admin" ? activities : activitiesActive;

    function handleLogin() {
        navigate("/login")
    }

    useEffect(() => {
        async function loadEvent() {
            try {
                const fetchedEvent = await eventDetail(id_event)
                setEvent(fetchedEvent)
            } catch (error) {
                console.error("Erro ao carregar eventos: ", error)
            }
        }
        if (id_event) {
            loadEvent()
        }
    }, [id_event])

    useEffect(() => {
        async function loadActivitiesActive() {
            try {
                const allActivities = await findAllActivitiesActiveOfEvent(id_event)
                setActivitiesActive(allActivities || [])
            } catch (error) {
                console.error("Erro ao carregar atividades: ", error);
            }
        }
        if (id_event) {
            loadActivitiesActive()
        }
    }, [id_event])

    useEffect(() => {
        async function loadActivities() {
            if (!isAuthenticated || role !== "admin") return;

            try {
                const activities = await findAllActivitiesOfEvent(id_event, token)
                setActivities(activities || [])
            } catch (error) {
                console.error("Erro ao carregar atividades: ", error);
            }
        }
        if (id_event) {
            loadActivities()
        }
    }, [id_event, isAuthenticated, role, token])

    useEffect(() => {
        if (!token) return;

        activitiesToShow.forEach(async (activity) => {
            try {
                const enrolled = await isUserEnrolled(token, activity.id_activity);
                setUserEnrolled(prev => ({ ...prev, [activity.id_activity]: enrolled }));
            } catch (err) {
                console.error(err);
            }
        });
    }, [activitiesToShow, token]);

    function formateDate(isoDate) {
        const data = new Date(isoDate)
        return data.toLocaleDateString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    function toggleActivity(id) {
        if (openActivity === id) {
            setOpenActivity(null)
        } else {
            setOpenActivity(id)
        }
    }

    async function handleRealizationEnrollment(id_activity, price) {
        const numericPrice = Number(price)
        setLoading(true)
        setShowMessage(true)
        setMessage("Processando sua inscrição...")
        try {
            if (!isAuthenticated) {
                setShowMessage(true)
                setMessage("Para se inscrever neste evento, é necessário efetuar login na plataforma.")
                return
            }
            if (numericPrice === 0) {
                await createEnrollment(id_activity, token)
                setShowMessage(true)
                setMessage("Parabéns! Inscrição efetuada com sucesso. Confira seu e-mail!")
            } else {
                setShowMessage(true)
                setMessage("Função de pagamento ainda não implementada.")
            }
        } catch (error) {
            setShowMessage(true)
            setMessage(error.message || "Erro ao realizar inscrição.")
        }
    }

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [showMessage])


    function handleConfigActivity(id_activity) {
        navigate(`/config/activity/${id_activity}`);
    }

    function handleCreateActivity() {
        navigate(`/create/activity/${id_event}`);
    }

    function handleUpdateEvent() {
        navigate(`/event/update/${id_event}`)
    }

    function toggleEventDelete() {
        if (openDeleteEvent) {
            setOpenDeleteEvent(false);
        } else {
            setOpenDeleteEvent(true);
        }
    }

    async function handleDeleteEvent(id_event) {
        if (activities.length >= 0) {
            setMessage("Para deletar esse evento, delete primeiro todas as suas atividades.");
            setShowMessage(true);
        }
        try {
            await deleteEvent(token, id_event);
            setMessage("Evento deletado com sucesso!");
            setShowMessage(true);
            const timer = setTimeout(() => {
                navigate("/");
            }, 3000)
            return () => clearTimeout(timer)

        } catch (error) {
            console.error("Erro ao deletar o evento: ", error);
        }
    }

    async function handleDisableEvent(id_event) {
        try {
            await disableEvent(id_event, token);
            setMessage("Evento Desabilitado com sucesso!");
            setShowMessage(true);
        } catch (error) {
            console.error("Erro ao desabilitar o evento: ", error);
        }
    }



    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
                <div className="absolute top-32 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

                {role === "admin" && <Menu></Menu>}
                {role === "user" && <MenuUser></MenuUser>}

                {!isAuthenticated && (
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
                            <div className="ml-auto">
                                <ButtonComponent label="Login" onClick={handleLogin} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative z-10">
                    {event ? (
                        <>
                            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
                                    <div className="flex md:flex-row flex-col">
                                        <div className="md:w-1/2 p-8 flex justify-center items-center">
                                            <img
                                                src={event.image_url || "/placeholder.svg"}
                                                className="w-full max-w-md h-64 md:h-80 object-cover rounded-2xl shadow-lg"
                                                alt={event.name}
                                            />
                                        </div>
                                        <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center md:text-left">
                                                {event.name}
                                            </h1>
                                            <p className="text-gray-600 text-lg mb-6 text-center md:text-left leading-relaxed">
                                                {event.description}
                                            </p>
                                            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                                                <p className="text-gray-700 font-semibold text-center md:text-left">
                                                    <span className="text-blue-600">Duração:</span> {formateDate(event.start_date)} até{" "}
                                                    {formateDate(event.end_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isAuthenticated && role === "admin" ? (

                                <div className="flex flex-col ">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Configure seu Evento</h2>
                                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                                    </div>

                                    <div className="md:flex md:flex-row grid-cols-2 grid items-center md:not-last:items-center justify-center mb-8 gap-1">
                                        <div className="flex items-center gap-4 ml-2">
                                            <ButtonComponent
                                                label="Editar"
                                                size="w-35 h-10"
                                                color="greenwater"
                                                onClick={handleUpdateEvent}
                                            >
                                                <FaEdit className="mb-1 mr-1"></FaEdit> Editar
                                            </ButtonComponent>
                                        </div>
                                        <div className="flex items-center gap-2 ml-2">
                                            <ButtonComponent
                                                label="Excluir"
                                                size="w-35 h-10"
                                                color="red"
                                                onClick={toggleEventDelete}
                                            >
                                                <FaTrash className="mb-1 mr-1"></FaTrash> Excluir
                                            </ButtonComponent>
                                        </div>
                                        <div className="flex items-center gap-2 ml-2">
                                            <ButtonComponent
                                                label="Visualizar Certificado"
                                                size="h-10"
                                                color="gray"
                                            >
                                                <FaEye className="mb-1 mr-1"></FaEye> Visualizar Certificado
                                            </ButtonComponent>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                            <ButtonComponent
                                                label="Desativar"
                                                size="h-10"
                                                color="purple"
                                                onClick={() => handleDisableEvent(id_event)} ///FALTA HABILITAR CORS
                                            >
                                                <FaLock className="mb-1 mr-1"></FaLock> Desativar
                                            </ButtonComponent>
                                        </div>
                                    </div>

                                    {openDeleteEvent && (
                                        <>
                                            <div
                                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                                                onClick={() => setOpenDeleteEvent(null)}
                                            />
                                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 max-w-lg w-[90%] max-h-[80vh] overflow-auto border border-gray-100">
                                                <div className="flex justify-between items-start mb-1 ml-5">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <h3 className="mb-2"><strong>Tem certeza que deseja excluir o evento?</strong></h3>
                                                        <div className="flex flex-row gap-2">
                                                            <ButtonComponent
                                                                label="Sim"
                                                                onClick={() => handleDeleteEvent(id_event)}
                                                            />
                                                            <ButtonComponent
                                                                label="Não"
                                                                color="red"
                                                                onClick={() => setOpenDeleteEvent(false)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setOpenDeleteEvent(null)}
                                                        className="p-0 hover:bg-gray-100 rounded-full transition-colors"
                                                        aria-label="Fechar modal"
                                                    >
                                                        <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div>
                                </div>
                            )}


                            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Atividades do Evento</h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activitiesToShow && activitiesToShow.length > 0 ? (
                                        activitiesToShow.map((activity) => (
                                            <div key={activity.id_activity} className="flex flex-col w-full max-w-xl mx-auto relative">
                                                <div className="bg-white rounded-t-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 overflow-hidden group h-40 flex flex-col">
                                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {activity.name}
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <FaCalendarAlt className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                                <span className="text-sm">Data: {formateDate(activity.date)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <FaClock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                                <span className="text-">Hora: {activity.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                {!isAuthenticated || isAuthenticated && role === "user" ? (

                                                    <div className="bg-gray-50 rounded-b-xl shadow-lg border-t border-gray-100 p-4 flex gap-2 h-16 items-center">
                                                        <button
                                                            onClick={() => toggleActivity(activity.id_activity)}
                                                            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                                                        >
                                                            <FaInfoCircle className="w-4 h-4" />
                                                            Mais Informações
                                                        </button>
                                                        {UserEnrolled[activity.id_activity] ? (
                                                            <button
                                                                className="cursor-not-allowed flex items-center gap-2 px-4 py-2  text-gray-600 text-sm font-medium"
                                                            >
                                                                <FaCheck className="w-4 h-4" />
                                                                Inscrito
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRealizationEnrollment(activity.id_activity, activity.price)}
                                                                className="cursor-pointer flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 text-sm font-medium"
                                                            >
                                                                <FaCheck className="w-4 h-4" />
                                                                Inscrever-se
                                                            </button>
                                                        )}

                                                    </div>


                                                ) : (

                                                    <div className="bg-gray-50 rounded-b-xl shadow-lg border-t border-gray-100 flex justify-center h-16 items-center">
                                                        <button
                                                            onClick={() => handleConfigActivity(activity.id_activity)}
                                                            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 text-sm font-medium"
                                                        >
                                                            <FaCog className="w-4 h-4" />
                                                            Configurar Atividade
                                                        </button>
                                                    </div>

                                                )}

                                                {openActivity === activity.id_activity && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                                                            onClick={() => setOpenActivity(null)}
                                                        />
                                                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 max-w-lg w-[90%] max-h-[80vh] overflow-auto border border-gray-100">
                                                            <div className="flex justify-between items-start mb-6">
                                                                <h1 className="text-2xl font-bold text-gray-800 pr-4">{activity.name}</h1>
                                                                <button
                                                                    onClick={() => setOpenActivity(null)}
                                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                                    aria-label="Fechar modal"
                                                                >
                                                                    <FaTimes className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                                                </button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <p className="text-gray-700 leading-relaxed">{activity.description}</p>

                                                                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-100">
                                                                    <div className="flex items-center gap-3">
                                                                        <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                                                                        <span className="text-gray-700">Data: {formateDate(activity.date)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <FaClock className="w-4 h-4 text-blue-500" />
                                                                        <span className="text-gray-700">Hora: {activity.time}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <FaMapMarkerAlt className="w-4 h-4 text-blue-500" />
                                                                        <span className="text-gray-700">Local: {activity.location}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <FaDollarSign className="w-4 h-4 text-green-500" />
                                                                        <span className="text-gray-700">Valor: R$ {activity.price}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                                                <p className="text-gray-600 text-lg">Nenhuma atividade cadastrada para este evento.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>



                            </div>

                            {isAuthenticated && role === "admin" ? (

                                <div className='md:justify-end justify-center bottom-0 md:fixed flex items-center md:right-3 right-0 md:m-2 m-5 font-semibold'>
                                    <ButtonComponent
                                        label="Criar Atividade"
                                        color='blue'
                                        size="md:w-50 w-45 md:h-10 h-8 "
                                        text="text-base"
                                        onClick={handleCreateActivity}
                                    >
                                    </ButtonComponent>
                                </div>
                            ) : (

                                <div className='md:justify-end justify-center bottom-0 md:fixed flex items-center md:right-3 right-0 md:m-2 m-5 font-semibold'>
                                    <ButtonComponent
                                        label="Patrocinar Evento"
                                        color='blue'
                                        size="md:w-50 w-45 md:h-10 h-8 "
                                        text="text-base"
                                    >
                                    </ButtonComponent>
                                </div>
                            )}

                        </>
                    ) : (
                        <div className="flex justify-center items-center min-h-[60vh]">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                                <p className="text-gray-600 text-lg">Carregando evento...</p>
                            </div>
                        </div>
                    )}

                    {message && showMessage && (
                        <div className="fixed top-20 right-6 z-50">
                            <div className="bg-white/95 backdrop-blur-sm border border-blue-200 text-blue-800 px-6 py-4 rounded-2xl shadow-lg max-w-sm">
                                <p className="font-medium">{message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
