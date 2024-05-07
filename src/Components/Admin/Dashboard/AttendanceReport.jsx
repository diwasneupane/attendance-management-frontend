import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faCalendarAlt, faChevronLeft, faChevronRight, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { TailSpin } from 'react-loader-spinner'; // Imported TailSpin loader

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

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
    const [itemsPerPage] = useState(40);
    const [initialLoad, setInitialLoad] = useState(true);
    const [dataRangeDisplay, setDataRangeDisplay] = useState("All Data");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        fetchData();
    }, []); // Fetch data initially when component mounts

    useEffect(() => {
        handleFiltering();
    }, [dateRange, searchTeacher, searchLevel]); // Update filtered data when date range, teacher, or level changes

    useEffect(() => {
        filterDataByDateRange(dateRange[0]);
    }, [dateRange]);

    const fetchData = async () => {
        try {
            // Fetch all attendance data from the server initially
            const response = await axiosInstance.get("/attendance/get-attendance");
            // Check if the response is successful and contains an array of data
            if (response.status === 200 && Array.isArray(response.data.data)) {
                // Set both report data and filtered data with the fetched data
                const fetchedData = response.data.data;
                setReportData(fetchedData);
                setFilteredData(fetchedData);
                // Set data range display to indicate all data
                setDataRangeDisplay("All Data");
                // Calculate total pages based on items per page and total data count
                setTotalPages(Math.ceil(fetchedData.length / itemsPerPage));
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
            // Set data range display to indicate all data
            setDataRangeDisplay("All Data");
            // Set total pages to 1 if there's no data
            setTotalPages(1);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };

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
        // Update data range display
        if (dateRange[0].startDate && dateRange[0].endDate) {
            const startDate = dateRange[0].startDate.toLocaleDateString();
            const endDate = dateRange[0].endDate.toLocaleDateString();
            setDataRangeDisplay(`From ${startDate} to ${endDate}`);
        }
        // Calculate total pages based on filtered data
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
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
    const handleDeleteAttendance = (attendanceId) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this attendance record?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axiosInstance.delete(`/attendance/delete-attendance/${attendanceId}`);
                            if (response.status === 200) {
                                toast.success('Attendance record deleted successfully');
                                fetchData(); // Refetch the data after successful deletion
                            } else {
                                toast.error('Failed to delete attendance record');
                            }
                        } catch (error) {
                            console.error('Error deleting attendance:', error);
                            toast.error('Failed to delete attendance record');
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderTableHeader = () => {
        return (
            <thead className="bg-blue-500 text-white">
                <tr>
                    <th className="px-6 py-3 text-left">S.No</th>
                    <th className="px-6 py-3 text-left">Teacher</th>
                    <th className="px-6 py-3 text-left">Level</th>
                    <th className="px-6 py-3 text-left">Section</th>
                    <th className="px-6 py-3 text-left">Time-In Time</th>
                    <th className="px-6 py-3 text-left">Time-Out Time</th>
                    <th className="px-6 py-3 text-left">Action</th>
                </tr>
            </thead>
        );
    };

    const renderTableRows = () => {
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

        return (
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(startIndex, endIndex).map((item, index) => (
                    <tr
                        key={item._id}
                        className="hover:bg-gray-100 transition-colors duration-200"
                    >
                        <td className="px-6 py-4 font-medium text-gray-900">{startIndex + index + 1}</td>
                        <td className="px-6 py-4">{item.teacher}</td>
                        <td className="px-6 py-4">{item.level}</td>
                        <td className="px-6 py-4">{item.section}</td>
                        <td className="px-6 py-4">{item.checkInTime}</td>
                        <td className="px-6 py-4">{item.checkOutTime}</td>
                        <td className="px-6 py-4">
                            <button
                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                onClick={() => handleDeleteAttendance(item._id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const renderPaginationInfo = () => {
        const totalItems = filteredData.length;
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);
        return `${startItem}-${endItem} of ${totalItems}`;
    };

    return (
        <div className="p-4 py-6">
            <div className="p-4 border-2 border-dotted border-gray-300 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>
                {loading && ( // Show loader while loading
                    <div className="flex items-center justify-center">
                        <TailSpin color="#0141cf" height={50} width={50} />
                    </div>
                )}
                {!loading && ( // Show content when not loading
                    <div>
                        <div className="flex items-center mb-6 gap-4">
                            <div className="relative w-1/3 group">
                                <input
                                    type="text"
                                    placeholder="Search by Teacher"
                                    value={searchTeacher}
                                    onChange={(e) => setSearchTeacher(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md transition-colors duration-200 ${dataRangeDisplay === 'All Data'
                                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                        : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                        }`}
                                    disabled={dataRangeDisplay === 'All Data'}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Please select a date range
                                </div>
                            </div>

                            <div className="relative w-1/3 group">
                                <input
                                    type="text"
                                    placeholder="Search by Level"
                                    value={searchLevel}
                                    onChange={(e) => setSearchLevel(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md transition-colors duration-200 ${dataRangeDisplay === 'All Data'
                                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                        : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                        }`}
                                    disabled={dataRangeDisplay === 'All Data'}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Please select a date range
                                </div>
                            </div>

                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="cursor-pointer text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 p-2 rounded-md"
                                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            />

                            <button
                                onClick={handleDownload}
                                className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-200 ${dataRangeDisplay === 'All Data'
                                    ? ' cursor-not-allowed relative group'
                                    : 'hover:bg-blue-600'
                                    }`}
                                disabled={dataRangeDisplay === 'All Data'}
                            >
                                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                Download
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    Please select a date range
                                </div>
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

                        <div className="mb-4 text-center py-2">
                            <div className="bg-white border border-gray-300 rounded-lg p-2">
                                <h3 className="text-lg font-semibold mb-2">Data Range</h3>
                                <p className="text-gray-700">{dataRangeDisplay}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto pt-4">
                            <table className="min-w-full divide-y divide-gray-200 text-center">
                                {renderTableHeader()}
                                {renderTableRows()}
                            </table>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div>{renderPaginationInfo()}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage === index + 1 ? 'bg-opacity-50' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Next
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceReport;
