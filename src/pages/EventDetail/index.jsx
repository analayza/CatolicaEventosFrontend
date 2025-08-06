import logo from '../../assets/logo-catolica.png';
import eventDetail from '../../service/EventDetail';
import ButtonComponent from "../../components/ButtonComponent";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import MenuUser from "../../components/MenuUserComponent";
import Menu from "../../components/MenuComponent";

export default function EventDetail() {

    const navigate = useNavigate();
    const { id_event } = useParams();
    const [event, setEvent] = useState(null);

    function handle() {
        navigate("/login");
    }

    useEffect(() => {
        async function loadEvent() {
            try {
                const fetchedEvent = await eventDetail(id_event);
                setEvent(fetchedEvent);
            } catch (error) {
                console.error("Erro ao carregar eventos:", error);
            }
        }
        if (id_event) {
            loadEvent();
        }
    }, [id_event]);

    const { role, isAuthenticated } = useContext(AuthContext);
    return (
        <>
            {
                role === "admin" && (
                    <Menu></Menu>
                )
            }
            {
                role === "user" && (
                    <MenuUser></MenuUser>
                )
            }
            {!isAuthenticated && (
                <div className="flex px-4 md:px-0 mt-3">
                    <div className="md:ml-5 md:mt-0 mt-2">
                        <img className="md:w-40 w-32 sm:w-40 h-auto mx-auto mt-[-2px]" src={logo} alt='Logo Católica'></img>
                    </div>
                    <div className="flex flex-row gap-3 w-full md:pr-8 flex-nowrap">
                        <div className="md:ml-10 ml-3 md:mt-3 mt-3">
                            <p className="md:text-4xl text-[#00559C] font-bold text-sm sm:text-xl md:mt-[-5px]">Católica Eventos</p>
                        </div>
                        <div className="ml-auto font-bold flex justify-end md:mt-3 mt-1 sm:mt-3 ">
                            <ButtonComponent
                                label="Login"
                                onClick={handle}
                                className=""
                            />
                        </div>
                    </div>
                </div>
            )}

            <div>
                {event ? (
                    <>
                        <div className='flex md:flex-row flex-col md:px-20 px-4 md:gap-18'>
                            <img src={event.image_url} className='md:w-[600px] w-[350px] h-[180px] md:h-[200px]  object-cover rounded-3xl md:mt-8 mt-5'></img>
                            <div className='flex flex-col md:mt-10 mt-4'>
                                <p className='text-center text-[#021D50] font-light md:text-2xl'>{event.name}</p>
                                <h3 className='text-xs  md:mt-2 mt-1 md:text-base'>{event.description}</h3>
                            </div>
                        </div>


                        <div>

                        </div>
                    </>
                ) : (
                    <>

                    </>
                )}
            </div>
        </>
    )
}