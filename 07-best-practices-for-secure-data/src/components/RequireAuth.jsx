import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    
    const roles = decoded?.userinfo?.roles || [];

    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;