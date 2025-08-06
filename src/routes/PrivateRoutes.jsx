import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const PrivateRoute = ({children, requiredRole}) => {
    const {isAuthenticated, role} = useAuth();
    if(!isAuthenticated){
        return <Navigate to="/"/>
    }
    if(requiredRole && role !== requiredRole){
        return <Navigate to="/"/>
    }
    return children;
}

export default PrivateRoute;