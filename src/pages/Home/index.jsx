import Menu from "../../components/MenuComponent"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import MenuUser from "../../components/MenuUserComponent"
import ButtonComponent from "../../components/ButtonComponent"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/logo-catolica.png"
import findAllEvents from "../../service/FindEvents"
import findAllEventsAdmin from "../../service/FindEventsAdmin"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
    const [events, setEvents] = useState([]);
    const { role, isAuthenticated, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate()
    function handle() {
        navigate("/login")
    }

    function handleImageClick(id_event) {
        navigate(`/event/${id_event}`)
    }

    function clearEvents() {
        setEvents([])
    }

    useEffect(() => {
        async function loadEvents() {
            try {
                if (isAuthenticated && role === "admin") {
                    const adminEvents = await findAllEventsAdmin(token)
                    console.log("Eventos admin:", adminEvents)
                    setEvents(adminEvents)
                } else {
                    const allEvents = await findAllEvents()
                    console.log("Eventos user ou não autenticado:", allEvents)
                    setEvents(allEvents)
                }
            } catch (error) {
                console.error("Erro ao carregar eventos:", error)
                setEvents([])
            } finally {
                setLoading(false);
            }
        }
        loadEvents()
    }, [isAuthenticated, role, token])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {role === "admin" && (
                <div className="relative">
                    <Menu onLogout={clearEvents} />
                    <div className="fixed bottom-0 md:right-3 right-0 m-5 font-semibold">
                        <ButtonComponent
                            label="Criar Evento"
                            color="blue"
                        ></ButtonComponent>
                    </div>
                </div>
            )}

            {role === "user" && <MenuUser />}

            {!isAuthenticated && (
                <header className="bg-white shadow-sm border-b border-blue-100">
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
                                <ButtonComponent label="Login" onClick={handle} />
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {(!isAuthenticated || (role === "user" && isAuthenticated)) && (
                <section className="bg-gradient-to-r from-[#00559C] to-[#021D50] text-white py-12 md:py-16">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">Eventos Acadêmicos</h2>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Acesse os eventos acadêmicos e aproveite todas as oportunidades de crescimento na sua jornada educacional!
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="w-24 h-1 bg-white rounded-full opacity-60"></div>
                        </div>
                    </div>
                </section>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {loading ? (
                    <>
                        <div className="text-center mb-8">
                            <Skeleton className="h-8 w-64 mx-auto mb-2" />
                            <Skeleton className="h-4 w-32 mx-auto" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl shadow-md overflow-hidden animate-pulse"
                                >
                                    <Skeleton className="h-48 w-full" />
                                    <div className="p-4">
                                        <Skeleton className="h-6 w-3/4 mx-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : events && events.length > 0 ? (
                    <>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#021D50] mb-2">
                                {role === "admin" ? "Gerenciar Eventos" : "Eventos Disponíveis"}
                            </h3>
                            <p className="text-gray-600">
                                {events.length} {events.length === 1 ? "evento encontrado" : "eventos encontrados"}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {events.map((event) => (
                                <div
                                    key={event.id_event}
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={event.image_url || "/placeholder.svg"}
                                            alt={event.name}
                                            className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                                            onClick={() => handleImageClick(event.id_event)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                                <svg className="w-4 h-4 text-[#00559C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-[#021D50] text-center text-sm md:text-base leading-tight group-hover:text-[#00559C] transition-colors duration-300">
                                            {event.name}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
                            <p className="text-gray-600">
                                Não há eventos disponíveis no momento. Volte em breve para conferir as novidades!
                            </p>
                        </div>
                    </div>
                )}
            </main>

            {(!isAuthenticated || (role === "user" && isAuthenticated)) && (
                <footer className="bg-white border-t border-gray-200 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-center md:justify-end">
                            <Link
                                to="/validate"
                                className="inline-flex items-center space-x-2 text-[#002266] font-semibold hover:text-[#0044cc] transition-colors duration-300 group"
                            >
                                <svg
                                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="border-b border-transparent group-hover:border-current">Validar Certificado</span>
                            </Link>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    )
}
