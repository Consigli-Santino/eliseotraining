import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HomeBar from "../HomeBar.jsx";
import HomeBarOptionsService from "../../services/HomeBarOptionsService.js";
import useAuth from "../../context/AuthContext.jsx";

const AppLayout = () => {
    const { user, availableRoutesSideBar, availableRoutesHomeBar, isAuthenticated } = useAuth();
    const location = useLocation();

    const publicRoutes = ['/login', '/', '/form-user', '/unauthorized'];
    if (publicRoutes.includes(location.pathname) || !isAuthenticated) {
        return <Outlet />;
    }

    const homeBarOptions = HomeBarOptionsService.getOptions(user?.roles || []);

    const filteredButtonsHome = homeBarOptions.filter((option) => {
        return availableRoutesHomeBar.includes(option.path);
    });

    return (
        <div className="d-flex flex-column min-vh-100">

            <div className="flex-grow-1">
                <Outlet />
            </div>

            {/* HomeBar fijo en todas las páginas autenticadas */}
            <HomeBar userOptions={filteredButtonsHome} />
        </div>
    );
};

export default AppLayout;