import logo from "../../assets/logo-catolica.png"
import eventDetail from "../../service/EventDetail"
import ButtonComponent from "../../components/ButtonComponent"
import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import MenuUser from "../../components/MenuUserComponent"
import Menu from "../../components/MenuComponent"
import { FaCheck, FaInfoCircle, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa"
import findAllActivitiesOfEvent from "../../service/FindAllActivitiesOfEvent"
import createEnrollment from "../../service/CreateEnrollment"

export default function EventDetail() {
    const navigate = useNavigate()
    const { id_event } = useParams()
    const { role, isAuthenticated, token } = useContext(AuthContext)

    const [event, setEvent] = useState(null)
    const [activities, setActivities] = useState([])
    const [openActivity, setOpenActivity] = useState(null)
    const [message, setMessage] = useState("")
    const [showMessage, setShowMessage] = useState(null)
    const [loading, setLoading] = useState(false)

    function handle() {
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
        async function loadActivities() {
            try {
                const allActivities = await findAllActivitiesOfEvent(id_event)
                setActivities(allActivities || [])
            } catch (error) {
                console.error("Erro ao carregar atividades: ", error)
                alert("Erro ao carregar atividades: " + error.message)
            }
        }
        if (id_event) {
            loadActivities()
        }
    }, [id_event])

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
                                <ButtonComponent label="Login" onClick={handle}  />
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

                            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Atividades do Evento</h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {activities && activities.length > 0 ? (
                                        activities.map((activity) => (
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

                                                <div className="bg-gray-50 rounded-b-xl shadow-lg border-t border-gray-100 p-4 flex gap-2 h-16 items-center">
                                                    <button
                                                        onClick={() => toggleActivity(activity.id_activity)}
                                                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                                                    >
                                                        <FaInfoCircle className="w-4 h-4" />
                                                        Mais Informações
                                                    </button>
                                                    <button
                                                        onClick={() => handleRealizationEnrollment(activity.id_activity, activity.price)}
                                                        className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 text-sm font-medium"
                                                    >
                                                        <FaCheck className="w-4 h-4" />
                                                        Inscrever-se
                                                    </button>
                                                </div>

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

                                <div className='md:justify-end justify-center bottom-0 md:fixed flex items-center md:right-3 right-0 md:m-2 m-5 font-semibold'>
                                    <ButtonComponent
                                        label="Patrocinar Evento"
                                        color='blue'
                                        size="md:w-50 w-45 md:h-10 h-8 "
                                        text="text-base"
                                    >
                                    </ButtonComponent>
                                </div>
                            </div>
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
