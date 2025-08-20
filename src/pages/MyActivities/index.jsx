import MenuUser from "../../components/MenuUserComponent";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import myActivities from "../../service/MyActivities";

import cancelEnrollment from "../../service/CancelEnrollment";
import { FaInfoCircle, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa"

export default function MyActivities() {

    const { id_event } = useParams();
    const [myListActivities, setMyListActivities] = useState([]);
    const { token } = useContext(AuthContext);

    const [openActivity, setOpenActivity] = useState(null);
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(null);

    useEffect(() => {
        async function loadMyActivities() {
            try {
                const activities = await myActivities(id_event, token);
                setMyListActivities(activities);
            } catch (error) {
                console.error("Erro ao carregar eventos: ", error);
            }
        }
        if (id_event) {
            loadMyActivities();
        }
    }, [id_event])

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

 
    async function handleCancelEnrollment(id_activity, price) {
        const numericPrice = Number(price);
        try {
        await cancelEnrollment(id_activity, token);
        setMyListActivities(prev => prev.filter(a => a.id_activity !== id_activity));

        setShowMessage(true);
        setMessage(
            numericPrice === 0
            ? "Sua inscrição foi cancelada com sucesso."
            : "Sua inscrição foi cancelada com sucesso. Confira seu email para devolução do valor integral."
        );
    } catch (error) {
            setShowMessage(true);
            setMessage(error.message || "Erro ao cancelar inscrição.");
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
      <MenuUser />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
        <div className="absolute top-32 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center pt-8 pb-6 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
              <FaCalendarAlt className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-800">Minhas Atividades</h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 px-4 pb-8 relative z-10">
          {myListActivities && myListActivities.length > 0 ? (
            myListActivities.map((activity, index) => (
              <div key={activity.id_activity} className="flex flex-col w-full max-w-md">
                <div className="bg-white rounded-t-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 overflow-hidden group h-40 flex flex-col">
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {activity.name}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCalendarAlt className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm">Data: {formateDate(activity.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm">Hora: {activity.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-b-xl shadow-lg border-t border-gray-100 p-4 flex gap-4 h-16 items-center">
                  <button
                    onClick={() => toggleActivity(activity.id_activity)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <FaInfoCircle className="w-4 h-4" />
                    Mais Informações
                  </button>
                  <button
                    onClick={() => handleCancelEnrollment(activity.id_activity, activity.price)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <FaTimes className="w-4 h-4" />
                    Cancelar Inscrição
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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <FaCalendarAlt className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-gray-500">Você ainda não se inscreveu em nenhuma atividade deste evento.</p>
            </div>
          )}
        </div>

        <div className="fixed top-20 right-4 z-50">
          {message && showMessage && (
            <div className="bg-white border border-blue-200 rounded-xl shadow-lg p-4 max-w-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}