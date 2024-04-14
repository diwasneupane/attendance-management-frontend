import React from "react";
import Header from "./Components/Admin/Header.jsx";
import SideNav from "./Components/Admin/SideNav.jsx";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <SideNav />
        </>
    );
}

export default Layout;
