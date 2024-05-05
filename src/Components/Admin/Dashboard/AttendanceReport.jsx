import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCalendarAlt, faChevronLeft, faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { DateRangePicker } from "react-date-range";
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
    const [filteredData, setFilteredData] = useState([]);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchLevel, setSearchLevel] = useState("");
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    useEffect(() => {
        fetchData();
    }, [currentPage, dateRange]); // Call fetchData when component mounts or pagination or date range changes

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/attendance/get-attendance", {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    checkInTimeRange: `${dateRange[0].startDate.toISOString()}_${dateRange[0].endDate.toISOString()}`
                }
            });
            if (response.status === 200 && Array.isArray(response.data.data)) {
                setReportData(response.data.data);
                setFilteredData(response.data.data);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setReportData([]);
            setFilteredData([]);
        }
    };
    useEffect(() => {
        filterDataByDateRange(dateRange[0]);
    }, [dateRange]); // Call filterDataByDateRange when date range changes

    const filterDataByDateRange = (selectedDateRange) => {
        const filtered = reportData.filter((item) => {
            const checkInTime = new Date(item.checkInTime);
            const startDate = new Date(selectedDateRange.startDate);
            const endDate = new Date(selectedDateRange.endDate);
            const checkInDate = new Date(checkInTime.getFullYear(), checkInTime.getMonth(), checkInTime.getDate());
            return checkInDate >= startDate && checkInDate <= endDate;
        });
        setFilteredData(filtered);
    };

    const handleDownload = async () => {
        try {
            let checkInTimeRange = "";
            if (dateRange[0].startDate && dateRange[0].endDate) {
                const startDate = new Date(dateRange[0].startDate.getTime() - dateRange[0].startDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
                const endDate = new Date(dateRange[0].endDate.getTime() - dateRange[0].endDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
                checkInTimeRange = `&checkInTimeRange=${startDate}_${endDate}`;
            }

            const response = await axiosInstance.get(`/attendance/get-attendance-excel?page=1&limit=10${checkInTimeRange}`, {
                responseType: "blob",
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "attendance_report.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading attendance report:", error);
        }
    };

    const handleDateChange = (ranges) => {
        const selectedDateRange = ranges.selection;
        setDateRange([
            {
                startDate: selectedDateRange.startDate,
                endDate: selectedDateRange.endDate,
                key: "selection",
            },
        ]);
        filterDataByDateRange(selectedDateRange);
    };

    const handleSearch = () => {
        const filtered = reportData.filter((item) => {
            const teacherMatch = item.teacher.toLowerCase().includes(searchTeacher.toLowerCase());
            const levelMatch = item.level.toLowerCase().includes(searchLevel.toLowerCase());
            return teacherMatch && levelMatch;
        });
        setFilteredData(filtered);
    };

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="p-4 py-6">
            <div className="p-4 border-2 border-dotted border-gray-300 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>

                <div className="flex items-center mb-4 gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by Teacher"
                            value={searchTeacher}
                            onChange={(e) => setSearchTeacher(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-blue-500" />
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
                            <FontAwesomeIcon icon={faSearch} className="text-blue-500" />
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
                        onChange={handleDateChange}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={dateRange}
                        direction="horizontal"
                    />
                )}

                <div className="overflow-x-auto pt-4">
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                        <thead className="bg-blue-0141cf">
                            <tr>
                                <th className="px-6 py-3">S.No</th>
                                <th className="px-6 py-3">Teacher</th>
                                <th className="px-6 py-3">Level</th>
                                <th className="px-6 py-3">Section</th>
                                <th className="px-6 py-3">Time-In Time</th>
                                <th className="px-6 py-3">Time-Out Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-yellow-ffa500 divide-y divide-gray-200">
                            {filteredData.map((item, index) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td>{item.teacher}</td>
                                    <td>{item.level}</td>
                                    <td>{item.section}</td>
                                    <td>{item.checkInTime}</td>
                                    <td>{item.checkOutTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={filteredData.length < itemsPerPage}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${filteredData.length < itemsPerPage ? 'opacity-50 cursor-not-allowed' : ''}`}
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
