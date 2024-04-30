import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
    return (
        <div className="p-4 py-5 bg-gray-50">
            <div className="border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700 p-6">
                {/* Welcome Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold">Welcome to Elite Attendance Management System</h2>
                    <img
                        src="/src/assets/logo.png"
                        alt="Elite Attendance Logo"
                        className="h-16 w-auto bg-white rounded-lg shadow-md p-2"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Adjust the number of columns */}
                    {/* Total Teachers Section */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg p-6 flex flex-col items-center">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="text-3xl text-indigo-600 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
                        <p className="text-4xl font-bold">10</p> {/* Example value */}
                    </div>

                    {/* Level 1 with Sections */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg p-6">
                        <div className="flex flex-col items-center">
                            <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-indigo-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Level 1</h3>
                            <p>Details about Level 1 or statistics</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Sections</h4>
                            <div className="grid grid-cols-2 gap-4"> {/* Grid for sections */}
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section A</div>
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section B</div>
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section C</div>
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section D</div>
                            </div>
                        </div>
                    </div>

                    {/* Level 2 with Sections */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg p-6">
                        <div className="flex flex-col items-center">
                            <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-indigo-600 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Level 2</h3>
                            <p>Details about Level 2 or other information</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Sections</h4>
                            <div className="grid grid-cols-2 gap-4"> {/* Grid for sections */}
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section E</div>
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section F</div>
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section G</div>
                                <div className="bg-gray-200 p-4 rounded-lg text-center">Section H</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
