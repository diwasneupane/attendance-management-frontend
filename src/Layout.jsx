import React from 'react';
import Sidebar from './Components/Admin/SideNav'; // Sidebar component
import { Outlet } from 'react-router-dom';
import Header from './Components/Admin/Header';

const Layout = () => {

    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col ">

                <div >
                    <Header />
                </div>


                <div
                    className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900"
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
