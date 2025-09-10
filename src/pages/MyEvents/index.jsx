import MenuUser from "../../components/MenuUserComponent";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ButtonComponent from "../../components/ButtonComponent";
import myEvents from "../../service/MyEvents";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton"
import { FaCalendarAlt } from "react-icons/fa";

export default function MyEvents() {

    const { token } = useContext(AuthContext);
    const [myEventsParticipated, setMyEventsParticipated] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    function handleActivitysParticipated(id_event) {
        navigate(`/${id_event}/my/activities`);
    }

    function handleMyCertificates() {
        navigate("/my/certificate");
    }


    useEffect(() => {
        async function loadEventParticipated() {
            try {
                const myEventsList = await myEvents(token);
                setMyEventsParticipated(myEventsList);
            } catch (error) {
                console.error("Erro ao carregar eventos: ", error);
            } finally {
                setLoading(false);
            }
        }
        if (token) {
            loadEventParticipated();
        }
    }, [token]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            <div className="absolute top-32 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

            <MenuUser />
            <div className="relative z-10 px-4 pb-24 mt-10">
                <div className="max-w-6xl mx-auto">
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
                        ) : myEventsParticipated && myEventsParticipated.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {myEventsParticipated.map((events) => (
                                    <div key={events.id_event} className="group">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 h-65 flex flex-col">
                                            <div className="relative overflow-hidden flex-shrink-0">
                                                <img
                                                    src={events.image_url || "/placeholder.svg"}
                                                    className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                                    alt={events.name}
                                                    onClick={() => handleActivitysParticipated(events.id_event)}
                                                />
                                                <div className="inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <div className="p-4 flex-1 flex items-center justify-center">
                                                <h3 className="text-gray-800 font-semibold text-center line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                                    {events.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                         <FaCalendarAlt className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum evento encontrado</h3>
                                    <p className="text-gray-500">Você ainda não participou de nenhum evento.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <div className='md:justify-end justify-center bottom-0 md:fixed flex items-center py-4 md:right-3 right-0 m-5 font-semibold z-50'>
                <ButtonComponent
                    label="Meus Certificados"
                    color="blue"
                    size="md:w-50 w-45 md:h-10 h-8 "
                    text="text-base"
                    onClick={handleMyCertificates}
                ></ButtonComponent>
            </div>
        </div>
    )
}