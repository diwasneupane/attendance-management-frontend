import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

function DashboardContent() {
    return (
        <div className="p-4 sm:ml-64 py-20">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-2">Welcome to Elite Attendance Management System</h2>
                        {/* Image */}
                        <img src="/src/assets/logo.png" alt="Elite Attendance Logo" className="h-24 mb-4 bg-white rounded-lg p-2" />
                    </div>
                    <div className="bg-gray-200 p-4 rounded-lg">
                        <div className="grid grid-rows-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
                                <h2 className="text-lg font-semibold mb-2">Total Teachers</h2>
                                <p className="text-4xl font-bold">10</p> {/* Example number */}
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold mb-2">Levels</h2>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Level 1 */}
                                    <div className="bg-white p-4 rounded-lg shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center h-20 w-20 bg-gray-300 rounded-lg">
                                                <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-gray-700" />
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <h3 className="text-lg font-semibold">Level 1</h3>
                                                <div className="bg-white p-2 rounded-lg shadow-md">
                                                    {/* Content for Level 1 */}
                                                    <p>Content for Level 1</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 2 */}
                                    <div className="bg-white p-4 rounded-lg shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center h-20 w-20 bg-gray-300 rounded-lg">
                                                <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-gray-700" />
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <h3 className="text-lg font-semibold">Level 2</h3>
                                                <div className="bg-white p-2 rounded-lg shadow-md">
                                                    {/* Content for Level 2 */}
                                                    <p>Content for Level 2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardContent;
