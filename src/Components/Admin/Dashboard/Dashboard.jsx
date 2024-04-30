import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSystemStats = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/system-stats');
                setStats(response.data.data);
            } catch (error) {
                setError('Error fetching system stats.');
            } finally {
                setLoading(false);
            }
        };

        fetchSystemStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-4 py-5 bg-gray-50">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center text-center mb-8">
                    <h2 className="text-2xl font-bold">Welcome to Elite Attendance Management System</h2>
                    <img
                        src="/src/assets/logo.png"
                        alt="Elite Attendance Logo"
                        className="h-16 w-auto bg-white rounded-lg shadow-md p-2"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-2xl text-indigo-600 mb-2" />
                        <h3 className="text-md font-semibold">Total Teachers</h3>
                        <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                    </div>

                    {stats.levelData.map((level, index) => (
                        <div key={index} className="bg-white border-2 border-dashed border-gray-300 rounded-lg shadow-lg p-6">
                            <div className="flex flex-col items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-3xl text-indigo-600 mb-4" />
                                <h3 className="text-lg font-semibold">{level.levelName}</h3>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold">Sections</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {level.sectionNames.map((section, idx) => (
                                        <div key={idx} className="bg-gray-200 p-4 rounded-lg text-center">
                                            {section}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
