import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import {useAuth} from '../../hooks/UseAuth';

export default function Menu() {

    const navigate = useNavigate();
    const {logoutContext} = useAuth();

    function handleLogout() {
        logoutContext();
        navigate('/');
    }

    return (
        <nav className="bg-[#00559C] flex flex-row h-auto w-full px-0">
            <p className="hidden md:block text-4xl md:text-4xl md:p-3 p-1 text-white text-lg font-bold">Católica Eventos</p>
            <ul className="flex flex-row space-x-4 md:space-x-5 text-white text-lg md:text-xl md:p-5 p-3 ml-auto md:ml-auto font-bold mx-auto md:mr-0">
                <li>
                    <NavLink to="/" className="flex items-center gap-1"
                    ><FaHome className="w-5 h-5" /> Home</NavLink>
                </li>
                <li>
                    <NavLink to="/update/admin" className="flex items-center gap-1"
                    ><FaCog className="w-5 h-5" /> Configurações</NavLink>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center gap-1"><FaSignOutAlt className="w-5 h-5" />Sair</button>
                </li>
            </ul>
        </nav>
    )
}