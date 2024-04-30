import React from 'react';
import Sidebar from './Components/Admin/SideNav'; // Sidebar component
import { Outlet } from 'react-router-dom';
import Header from './Components/Admin/Header';

const Layout = () => {
    // const headerHeight = '0rem'; // Example height of the header

    return (
        <div className="flex h-screen">
            {/* Sidebar with fixed width */}
            <Sidebar />

            <div className="flex flex-1 flex-col ">

                <div >
                    <Header />
                </div>

                {/* Main content with padding to prevent hiding behind the header */}
                <div
                    className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900"
                // style={{ paddingTop: headerHeight }} // Add padding to avoid overlapping
                >
                    <Outlet /> {/* Outlet renders child routes */}
                </div>
            </div>
        </div>
    );
};

export default Layout;
