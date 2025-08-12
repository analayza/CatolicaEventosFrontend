import logo from '../../assets/logo-catolica.png';
import eventDetail from '../../service/EventDetail';
import ButtonComponent from "../../components/ButtonComponent";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import MenuUser from "../../components/MenuUserComponent";
import Menu from "../../components/MenuComponent";
import { FaCheck } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import findAllActivitiesOfEvent from '../../service/FindAllActivitiesOfEvent';
import { FaTimes } from 'react-icons/fa';
import createEnrollment from '../../service/CreateEnrollment';

export default function EventDetail() {

    const navigate = useNavigate();
    const { id_event } = useParams();
    const { role, isAuthenticated, token } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [activities, setActivities] = useState([]);
    const [openActivity, setOpenActivity] = useState(null);
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(null);


    function handle() {
        navigate("/login");
    }

    useEffect(() => {
        async function loadEvent() {
            try {
                const fetchedEvent = await eventDetail(id_event);
                setEvent(fetchedEvent);
            } catch (error) {
                console.error("Erro ao carregar eventos: ", error);
            }
        }
        if (id_event) {
            loadEvent();
        }
    }, [id_event]);


    useEffect(() => {
        async function loadActivities() {
            try {
                const allActivities = await findAllActivitiesOfEvent(id_event);
                setActivities(allActivities || []);
            } catch (error) {
                console.error("Erro ao carregar atividades: ", error)
                alert("Erro ao carregar atividades: " + error.message);
            }
        }
        if (id_event) {
            loadActivities();
        }

    }, [id_event]);


    function formateDate(isoDate) {
        const data = new Date(isoDate);
        return data.toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    function toggleActivity(id) {
        if (openActivity === id) {
            setOpenActivity(null);
        } else {
            setOpenActivity(id);
        }
    }

    async function handleRealizationEnrollment(id_activity, price) {
        const numericPrice = Number(price);
        try {
            if (!isAuthenticated) {
                setShowMessage(true);
                setMessage("Para se inscrever neste evento, é necessário efetuar login na plataforma.");
                return;
            }
            if (numericPrice === 0) {
                await createEnrollment(id_activity, token);
                setShowMessage(true);
                setMessage("Parabéns! Inscrição efetuada com sucesso. Confira seu e-mail!");
            } else {
                setShowMessage(true);
                setMessage("Função de pagamento ainda não implementada.");
            }
        } catch (error) {
            setShowMessage(true);
            setMessage(error.message || "Erro ao realizar inscrição.");
        }
    }


    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);


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
                            <div className='justify-center items-center flex'><img src={event.image_url} className=' md:w-[600px] w-[350px] h-[180px] md:h-[200px]  object-cover rounded-3xl md:mt-8 mt-5'></img></div>
                            <div className='flex flex-col md:mt-13 mt-4'>
                                <p className='text-center text-[#021D50] font-light md:text-2xl'>{event.name}</p>
                                <h3 className='text-center text-xs md:mt-2 mt-1 md:text-base'>{event.description}</h3>
                                <h3 className='text-center mt-4'><strong>Duração do Evento:</strong> {formateDate(event.start_date)} á {formateDate(event.end_date)}</h3>
                            </div>
                        </div>
                        <div className='mt-2 text-2xl ml-10'>
                            <p className='text-[#021D50] font-light'>Atividades do Evento:</p>
                        </div>
                        <div className='flex flex-wrap justify-center pb-2'>
                            {(activities && activities.length > 0) ? (
                                activities.map((activity) => (

                                    <div key={activity.id_activity} className='flex flex-col'>

                                        <div className='flex justify-start border border-t-[#00559C] border-t-3 rounded-t mt-3 border-[#dddddd] h-25 w-[320px] md:w-[390px] mx-2 md:h-[130px]'>
                                            <div className='flex flex-col ml-4 mt-2 gap-3'>
                                                <h2>{activity.name}</h2>
                                                <h3>Data: {formateDate(activity.date)} Hora: {activity.time}</h3>
                                            </div>
                                        </div>
                                        <div className='flex border rounded-b border-[#dddddd] h-10 w-[320px] md:w-[390px] mx-2 bg-[#F8F8F8]'>
                                            <button onClick={() => toggleActivity(activity.id_activity)} className='md:ml-5 ml-3 text-[#777777] flex flex-row items-center gap-1 text-xs md:text-base cursor-pointer'> <FaInfoCircle></FaInfoCircle> Mais Informações</button>
                                            <button onClick={() => handleRealizationEnrollment(activity.id_activity, activity.price)} className='md:ml-5 ml-3 text-[#777777] flex flex-row items-center gap-1 text-xs md:text-base cursor-pointer'><FaCheck className=''></FaCheck>Realizar Inscrição</button>
                                        </div>
                                        {openActivity === activity.id_activity && (
                                            <>

                                                <div
                                                    className="fixed inset-0 bg-black opacity-60"
                                                    onClick={() => setOpenActivity(null)}
                                                ></div>
                                                <div
                                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                                            bg-white rounded-xl shadow-xl p-6 z-50 max-w-lg w-[90%] max-h-[80vh] overflow-auto"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <h1 className='text-xl font-bold'>{activity.name}</h1>
                                                        <button onClick={() => setOpenActivity(null)} aria-label="Fechar modal">
                                                            <FaTimes className='w-6 h-6 text-gray-700 hover:text-gray-900' />
                                                        </button>
                                                    </div>
                                                    <p className="mt-4">{activity.description}</p>
                                                    <p className="mt-2">Data: {formateDate(activity.date)} Hora: {activity.time}</p>
                                                    <p>Local: {activity.location}</p>
                                                    <p>Valor: {activity.price}</p>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                ))
                            ) : (<>
                                <p className="text-center mt-4">Nenhuma atividade cadastrada para este evento.</p>
                            </>)}
                        </div>

                    </>
                ) : (
                    <>

                    </>
                )}
                <div className='flex justify-end md:mr-5 mr-7 fixed top-16 right-0'>
                    {message && showMessage && (
                        <div className="text-center md:h-9 md:w-135 h-10 w-85 text-sm bg-gray-100 flex flex-row text-[#00559C] mt-4 justify-center items-center border rounded-2xl">
                            <p className=''>{message}</p>
                        </div>
                    )}
                </div>

                <div className='fixed bottom-0 right-0 m-2'>
                    <ButtonComponent 
                    label="Patrocinar Evento"
                    color='blue'
                    size="md:w-50 w-40 "
                    text="text-base"
                    >
                    </ButtonComponent>
                </div>
            </div>
        </>
    )
}