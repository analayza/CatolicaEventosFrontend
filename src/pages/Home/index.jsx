import Menu from "../../components/MenuComponent";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import MenuUser from "../../components/MenuUserComponent";
import ButtonComponent from "../../components/ButtonComponent";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo-catolica.png';
import findAllEvents from "../../service/FindEvents";
import findAllEventsAdmin from "../../service/FindEventsAdmin";

export default function Home() {

    const [events, setEvents] = useState([]);
    const { role, isAuthenticated, token } = useContext(AuthContext);

    const navigate = useNavigate()
    function handle() {
        navigate("/login");
    }

    function handleImageClick(id_event) {
        navigate(`/event/${id_event}`);
    }

    function clearEvents() {
        setEvents([]);
    }

    useEffect(() => {
        async function loadEvents() {
            try {
                if (isAuthenticated && role === "admin") {
                    const adminEvents = await findAllEventsAdmin(token);
                    console.log("Eventos admin:", adminEvents);
                    setEvents(adminEvents);
                }
                else {
                    const allEvents = await findAllEvents();
                    console.log("Eventos user ou não autenticado:", allEvents);
                    setEvents(allEvents);
                }
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
                setEvents([])
            }

        }
        loadEvents();
    }, [isAuthenticated, role, token]);


    return (
        <>
            {
                role === "admin" && (
                    <div className="">
                        <Menu
                            onLogout={clearEvents}
                        ></Menu>
                        <div className="ml-auto font-bold flex justify-end px-3 md:mt-3 mt-1 sm:mt-3">
                            <ButtonComponent
                                label="Criar Evento"
                                color="blue"
                            ></ButtonComponent>
                        </div>
                    </div>
                )
            }
            {
                role === "user" && (
                    <MenuUser></MenuUser>
                )
            }
            {!isAuthenticated && (
                <div className="flex px-4 md:px-0 mt-2">
                    <div className="md:ml-5 md:mt-0 mt-2">
                        <img className="md:w-40 w-32 sm:w-40 h-auto mx-auto mt-[-2px]" src={logo} alt='Logo Católica'></img>
                    </div>
                    <div className="flex flex-row gap-3 w-full md:pr-8 flex-nowrap">
                        <div className="md:ml-10 ml-3 md:mt-3 mt-3">
                            <p className="md:text-4xl text-[#00559C] font-bold text-sm sm:text-xl md:mt-[-5px]">Católica Eventos</p>
                        </div>
                        <div className="ml-auto font-bold flex justify-end md:mt-3 mt-1 sm:mt-3">
                            <ButtonComponent
                                label="Login"
                                onClick={handle}
                                color="green"
                                className=""
                            />
                        </div>
                    </div>
                </div>
            )}
            {((!isAuthenticated) || (role === "user" && isAuthenticated)) && (
                <div className="items-center justify-center w-full flex flex-col mt-4">
                    <p className="text-[#021D50] text-xs px-3 md:text-base">
                        Acesse os eventos acadêmicos e aproveite todas as
                    </p>
                    <p className="text-[#021D50] text-xs px-3 text-center md:text-base">
                        oportunidades de crescimento na sua jornada educacional!
                    </p>
                </div>
            )}

            <div className="flex flex-wrap justify-center items-center md:gap-9 gap-2">
                
                {(events && events.length > 0) ? (
                    events.map((event) => (

                        <div key={event.id_event} className="w-[200px] h-[200px] object-cover md:w-72 md:h-40 mt-4 md:mt-5 flex flex-col px-2">
                            <img
                                src={event.image_url}
                                className="w-full h-40 rounded-3xl cursor-pointer"
                                onClick={() => handleImageClick(event.id_event)}
                            ></img>
                            <h3 className="mt-1 w-full text-center">{event.name}</h3>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center mt-12 px-4">
                        
                    </div>
                )}
            </div>
            {((!isAuthenticated) || (role === "user" && isAuthenticated)) && (
                <footer className="md:fixed md:bottom-2 md:right-4 md:z-50 w-full mt-10 px-4">
                    <div className="flex justify-end">
                        <Link
                            to="/validate"
                            className="text-[#002266] font-semibold hover:underline hover:text-[#0044cc] transition-colors duration-300"
                        >
                            Validar Certificado
                        </Link>
                    </div>
                </footer>
            )}
        </>
    )
}