import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaClipboardList } from "react-icons/fa";
import {useAuth} from '../../hooks/UseAuth';

export default function MenuUser() {

    const navigate = useNavigate();
    const {logoutContext} = useAuth();

    function handleLogout() {
        navigate('/');
        logoutContext();
    }

    return (
        <nav className="bg-[#00559C] flex flex-row h-auto w-full px-0 justify-center">
            <p className="hidden md:block  md:text-4xl md:p-3 p-1 text-white text-lg font-bold">Católica Eventos</p>
            <ul className="justify-center items-center md:flex-row flex flex-row  space-x-3 md:space-x-5 text-white text-xs md:text-xl md:p-5 p-3 md:ml-auto font-bold md:mr-0">
                <li>
                    <NavLink to="/" className="flex items-center gap-1"
                    ><FaHome className="w-5 h-5" /> Home</NavLink>
                </li>
                <li className="hidden md:flex">
                    <NavLink to="/my/events" className="flex items-center gap-1 whitespace-nowrap"
                    ><FaClipboardList className="w-5 h-5 mb-1" /> Meus Eventos</NavLink>
                </li>
                <li className="flex md:hidden">
                    <NavLink to="/my/events" className="flex items-center gap-1"
                    ><FaClipboardList className="w-5 h-5 mb-1" /> Eventos</NavLink>
                </li>
                <li>
                    <NavLink to="/update/user" className="flex items-center gap-1"
                    ><FaCog className="w-5 h-5" /> Configurações</NavLink>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center gap-1"><FaSignOutAlt className="w-5 h-5" />Sair</button>
                </li>
            </ul>
        </nav>
    )
}