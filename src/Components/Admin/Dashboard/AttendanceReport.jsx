import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function AttendanceReport() {
    // Sample data
    const [reportData, setReportData] = useState([
        { name: 'John Doe', date: '2024-04-16', level: 'Level 1', section: 'A', checkIn: '08:00 AM', checkOut: '04:00 PM' },
        { name: 'Jane Smith', date: '2024-04-16', level: 'Level 2', section: 'B', checkIn: '08:30 AM', checkOut: '03:30 PM' },
        { name: 'Jane Smith', date: '2024-04-16', level: 'Level 2', section: 'h', checkIn: '08:30 AM', checkOut: '03:30 PM' },
        { name: 'Jane Smith', date: '2024-04-16', level: 'Level 2', section: 'g', checkIn: '08:30 AM', checkOut: '03:30 PM' },
        { name: 'Jane Smith', date: '2024-04-16', level: 'Level 3', section: 'c', checkIn: '08:30 AM', checkOut: '03:30 PM' },
        { name: 'Jane Smith', date: '2024-04-16', level: 'Level 4', section: 'd', checkIn: '08:30 AM', checkOut: '03:30 PM' },
        // Add more sample data as needed
    ]);

    // Search query state
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered data state
    const [filteredData, setFilteredData] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Calculate indexes for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Update filtered data when search query changes
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = reportData.filter(
            (item) =>
                `${item.name.toLowerCase()} ${item.level.toLowerCase()} ${item.section.toLowerCase()}`.includes(
                    lowerCaseQuery
                )
        );
        setFilteredData(filtered);
    }, [searchQuery, reportData]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle download button click
    const handleDownload = () => {
        // Implement download logic here
        console.log('Download button clicked');
    };

    // Pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate dynamic IDs for table rows
    const generateID = () => Math.floor(Math.random() * 10000);

    // Sort data by check-in time
    const sortedData = currentItems.sort((a, b) => {
        const timeA = new Date(`01/01/2000 ${a.checkIn}`);
        const timeB = new Date(`01/01/2000 ${b.checkIn}`);
        return timeA - timeB;
    });

    return (
        <div className="p-4 sm:ml-64 py-20">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>
                <div className="flex items-center mb-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="ml-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.map((item, index) => (
                                <tr key={generateID()}>
                                    <td className="px-6 py-4 whitespace-nowrap">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.level}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.section}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.checkIn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.checkOut}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentItems.length < itemsPerPage}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentItems.length < itemsPerPage ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Next
                        <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttendanceReport;
