import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import api from "../api/api";
import Loader from "../utils/Loader";
import { Link } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import ApiDetails from "./ApiDetails";
import ApiCallLogs from "./ApiCallLogs";
import ApiLoadTest from "./ApiLoadTest";
import ApiLoadTest2 from "./ApiLoadTest2";
const ViewAPI = () => {
  const { id } = useParams();
  const [apiData, setApiData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHitAPI, setIsLoadingHitAPI] = useState(false);
  const [selectedTab, setSelectedTab] = useState("callLogs");

  useEffect(() => {
    fetchApiData();
    fetchLogs();
  }, [id, page, pageSize]);

  const fetchApiData = async () => {
    try {
      const response = await api.get(`api/api-list/${id}/`);
      setApiData(response.data);
    } catch (error) {
      toast.error(
        "Error fetching API: " + (error.response?.data?.detail || error.message)
      );
      console.error("Error fetching API:", error);
    }
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`api/api-list/${id}/call-logs/`, {
        params: { page, page_size: pageSize },
      });
      setLogs(response.data.call_logs);
      setTotalLogs(response.data.total_logs);
    } catch (error) {
      // toast.error(
      //   "Error fetching logs: " +
      //     (error.response?.data?.detail || error.message)
      // );
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHitAndLog = async () => {
    setIsLoading(true);
    setIsLoadingHitAPI(true);
    try {
      await api.post(`api/hit-api/${id}/`);
      fetchApiData();
      fetchLogs();
    } catch (error) {
      // toast.error(
      //   error?.response?.data?.detail ||
      //     error?.message ||
      //     "Error hitting and logging API"
      // );
      console.error("Error hitting and logging API:", error);
      setIsLoading(false);
      setIsLoadingHitAPI(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  function formatDateShort(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const chartData = useMemo(
    () => ({
      labels: logs.map((log) => formatDateShort(log.timestamp)),
      datasets: [
        {
          label: "Response Time",
          data: logs.map((log) => log.response_time),
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    }),
    [logs]
  );

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 45 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Response Time (seconds)" },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const paginate = (pageNumber) => setPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageNumbers = Math.ceil(totalLogs / pageSize);
    const maxVisibleButtons = 5;
    const buttons = [];

    let startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(pageNumbers, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="start"
          onClick={() => paginate(1)}
          className="pagination-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-button ${page === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pageNumbers) {
      if (endPage < pageNumbers - 1) {
        buttons.push(<span key="end-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key="end"
          onClick={() => paginate(pageNumbers)}
          className="pagination-button"
        >
          {pageNumbers}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className=" mx-auto bg-white rounded-lg  overflow-hidden">
        {/* API Detials section*/}
        <h2 className="text-2xl font-bold mb-4">API Details</h2>
        {apiData ? (
          <ApiDetails apiData={apiData} formatDate={formatDate} />
        ) : (
          <Loader />
        )}

        {/* Navbar: calllogs | load test*/}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab("callLogs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                selectedTab === "callLogs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Call Logs
            </button>
            <button
              onClick={() => setSelectedTab("loadTest1")}
              className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                selectedTab === "loadTest1"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Load Test
            </button>
            <button
              onClick={() => setSelectedTab("loadTest2")}
              className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                selectedTab === "loadTest2"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Load Test
            </button>
          </nav>
        </div>

        {/* main content: calllogs:loadtest */}
        {selectedTab == "callLogs" ? (
          <ApiCallLogs
            logs={logs}
            page={page}
            pageSize={pageSize}
            totalLogs={totalLogs}
            paginate={paginate}
            handleHitAndLog={handleHitAndLog}
            formatDate={formatDate}
            isLoading={isLoading}
            renderPaginationButtons={renderPaginationButtons}
            chartData={chartData}
            chartOptions={chartOptions}
          />
        ) : (
          <></>
        )}
        {selectedTab === "loadTest1" && <ApiLoadTest />}

        {selectedTab === "loadTest2" && <ApiLoadTest2 />}
      </div>
    </div>
  );
};

export default ViewAPI;
