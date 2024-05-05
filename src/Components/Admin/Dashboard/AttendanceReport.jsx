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
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

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
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        fetchData();
    }, []); // Fetch data initially when component mounts

    useEffect(() => {
        handleFiltering();
    }, [dateRange, searchTeacher, searchLevel]); // Update filtered data when date range, teacher, or level changes

    const fetchData = async () => {
        try {
            // Fetch attendance data from the server
            const response = await axiosInstance.get("/attendance/get-attendance");

            // Check if the response is successful and contains an array of data
            if (response.status === 200 && Array.isArray(response.data.data)) {
                // Set both report data and filtered data with the fetched data
                const fetchedData = response.data.data;
                setReportData(fetchedData);
                setFilteredData(fetchedData);
            } else {
                // If the response format is unexpected, throw an error
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            // Handle any errors that occur during the fetching process
            console.error("Error fetching attendance data:", error);
            // Reset report data and filtered data to an empty array
            setReportData([]);
            setFilteredData([]);
        }
    };
    useEffect(() => {
        filterDataByDateRange(dateRange[0]);
    }, [dateRange]);



    const handleDownload = async (singleDayData = false) => {
        try {
            let url = "/attendance/get-attendance-excel";

            // Get the selected date range
            const selectedDateRange = dateRange[0];

            // Construct the date range string
            let dateRangeString = "";
            if (selectedDateRange.startDate && selectedDateRange.endDate) {
                const startDate = selectedDateRange.startDate.toISOString().split("T")[0];
                const endDate = selectedDateRange.endDate.toISOString().split("T")[0];
                dateRangeString = `${startDate}_${endDate}`;
            } else if (singleDayData && selectedDateRange.startDate) {
                const selectedDate = selectedDateRange.startDate.toISOString().split("T")[0];
                dateRangeString = selectedDate;
            }

            // Log the constructed date range string
            console.log("Selected Date Range:", dateRangeString);

            // Append date range to URL query parameters
            if (dateRangeString) {
                url += `?checkInTimeRange=${dateRangeString}`;
            }

            const response = await axiosInstance.get(url, {
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

    const handleFiltering = () => {
        const filtered = reportData.filter(item => {
            const checkInDate = new Date(item.checkInTime);
            const withinDateRange = (
                checkInDate >= dateRange[0].startDate &&
                checkInDate <= dateRange[0].endDate
            );
            const matchesSearch = (
                searchTeacher === "" || item.teacher.toLowerCase().includes(searchTeacher.toLowerCase())
            ) && (
                    searchLevel === "" || item.level.toLowerCase().includes(searchLevel.toLowerCase())
                );
            return withinDateRange && matchesSearch;
        });
        setFilteredData(filtered);
    };

    const filterDataByDateRange = (selectedDateRange) => {
        const startDate = new Date(selectedDateRange.startDate);
        const endDate = new Date(selectedDateRange.endDate);

        const filtered = reportData.filter((item) => {
            const checkInTime = new Date(item.checkInTime);
            const checkInDate = new Date(checkInTime.getFullYear(), checkInTime.getMonth(), checkInTime.getDate());
            return checkInDate >= startDate && checkInDate <= endDate;
        });

        setFilteredData(filtered);
    };
    const handleDateChange = (ranges) => {
        const selectedDateRange = ranges.selection;

        if (selectedDateRange.startDate && selectedDateRange.endDate) {
            setDateRange([
                {
                    startDate: selectedDateRange.startDate,
                    endDate: selectedDateRange.endDate,
                    key: "selection",
                },
            ]);
            filterDataByDateRange(selectedDateRange);
        } else if (selectedDateRange.startDate) {

            const selectedDate = selectedDateRange.startDate;
            setDateRange([
                {
                    startDate: selectedDate,
                    endDate: selectedDate,
                    key: "selection",
                },
            ]);
            filterDataByDateRange({ startDate: selectedDate, endDate: selectedDate });
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderTableHeader = () => {
        return (
            <thead className="bg-[#0141cf] text-white">
                <tr>
                    <th className="px-6 py-3">S.No</th>
                    <th className="px-6 py-3">Teacher</th>
                    <th className="px-6 py-3">Level</th>
                    <th className="px-6 py-3">Section</th>
                    <th className="px-6 py-3">Time-In Time</th>
                    <th className="px-6 py-3">Time-Out Time</th>
                </tr>
            </thead>
        );
    };

    const renderTableRows = () => {
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

        return (
            <tbody className="bg-[#ffffff] divide-y divide-gray-200">
                {filteredData.slice(startIndex, endIndex).map((item, index) => (
                    <tr key={item._id}>
                        <td className="px-6 py-4">{startIndex + index + 1}</td>
                        <td>{item.teacher}</td>
                        <td>{item.level}</td>
                        <td>{item.section}</td>
                        <td>{item.checkInTime}</td>
                        <td>{item.checkOutTime}</td>
                    </tr>
                ))}
            </tbody>
        );
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
                        {renderTableHeader()}
                        {renderTableRows()}
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
