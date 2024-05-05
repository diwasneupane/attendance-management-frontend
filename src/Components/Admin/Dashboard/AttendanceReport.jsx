import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload, faChevronLeft, faChevronRight, faTrash, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

const AttendanceReport = () => {
    const [reportData, setReportData] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchLevel, setSearchLevel] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    useEffect(() => {
        fetchDataWithPagination();
    }, [currentPage, selectedStartDate, dateRange]);

    const fetchDataWithPagination = async () => {
        try {
            const startDate = selectedStartDate ? selectedStartDate.toISOString() : null;
            const endDate = dateRange[0].endDate.toISOString();
            const response = await axiosInstance.get("/attendance/get-attendance", {
                params: {
                    startTime: startDate,
                    endTime: endDate,
                    page: currentPage,
                    limit: itemsPerPage
                },
            });
            if (response.status === 200 && Array.isArray(response.data.data)) {
                setReportData(response.data.data);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            toast.error("Error fetching attendance data.");
            setReportData([]);
        }
    };

    const handleDayClick = (day) => {
        setSelectedStartDate(day);
    };

    const filteredData = reportData.filter((item) => {
        const teacherName = item.teacher ? item.teacher.toLowerCase() : "";
        const levelName = typeof item.level === "string" ? item.level.toLowerCase() : "";
        return teacherName.includes(searchName.toLowerCase()) && levelName.includes(searchLevel.toLowerCase());
    });

    const handleDelete = (item) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: `Are you sure you want to delete the record for "${item.teacher}"?`,
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            await axiosInstance.delete(`/attendance/delete-attendance/${item._id}`);
                            setReportData((prev) => prev.filter((data) => data._id !== item._id));
                            toast.success("Record deleted successfully.");
                        } catch (error) {
                            toast.error("Error deleting attendance record.");
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const handleDownload = async () => {
        try {
            const response = await axiosInstance.get("/attendance/get-attendance-excel", {
                responseType: "blob",
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "attendance_report.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Download started.");
        } catch (error) {
            toast.error("Error downloading attendance report.");
        }
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="p-4 py-6">
            <ToastContainer autoClose={3000} position="top-center" />

            <div className="p-4 border-2 border-dotted border-gray-300 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>

                <div className="flex items-center mb-4 gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by Level"
                            value={searchLevel}
                            onChange={(e) => setSearchLevel(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="cursor-pointer flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    />

                    <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download
                    </button>
                </div>

                {isDatePickerOpen && (
                    <DateRangePicker
                        onChange={(item) => setDateRange([item.selection])}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={dateRange}
                        direction="horizontal"
                    />
                )}

                <div className="overflow-x-auto pt-4">
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Teacher</th>
                                <th className="px-6 py-3">Level</th>
                                <th className="px-6 py-3">Section</th>
                                <th className="px-6 py-3">Time-In Time</th>
                                <th className="px-6 py-3">Time-Out Time</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((item, index) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td>{item.teacher}</td>
                                    <td>{item.level}</td>
                                    <td>{item.section}</td>
                                    <td>{item.checkInTime}</td>
                                    <td>{item.checkOutTime}</td>
                                    <td>
                                        <button
                                            className="text-red-500"
                                            onClick={() => handleDelete(item)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={filteredData.length < itemsPerPage}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md`}
                    >
                        Next
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
