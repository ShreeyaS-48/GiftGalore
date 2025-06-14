import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log("auth:", auth);
    console.log("allowedRoles:", allowedRoles);
    const hasRole = auth?.roles?.filter(Boolean).some(role => allowedRoles.includes(role));
    
    if (hasRole) {
        return <Outlet />;
    } else if (auth?.accessToken) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    } else {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }
}

export default RequireAuth;