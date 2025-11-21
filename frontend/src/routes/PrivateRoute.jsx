import { Navigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

export const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { keycloak } = useKeycloak();

    if (keycloak?.authenticated === undefined) {
        return null;
    }

    if (keycloak?.authenticated) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};
