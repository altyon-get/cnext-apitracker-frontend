import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import api from "../api/api";
import Loader from "../components/Loader";
import { FaCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiEdit2, FiEye, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";

const ViewAPI = () => {
  const { id } = useParams();
  const [apiData, setApiData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(apiData.endpoint)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    fetchApiData();
    fetchLogs();
  }, [id, page, pageSize]);

  const fetchApiData = () => {
    api
      .get(`api/api-list/${id}/`)
      .then((response) => setApiData(response.data))
      .catch((error) => console.error("Error fetching API:", error));
  };

  const fetchLogs = () => {
    setIsLoading(true);
    api
      .get(`api/api-list/${id}/call-logs/`, {
        params: { page, page_size: pageSize },
      })
      .then((response) => {
        setLogs(response.data.call_logs);
        setTotalLogs(response.data.total_logs);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching logs:", error);
      });
  };

  const handleHitAndLog = () => {
    setIsLoading(true);
    api
      .get(`api/hit-api/${id}`)
      .then(() => {
        fetchApiData();
        fetchLogs();
      })
      .catch((error) => {
        console.error("Error hitting and logging API:", error);
        setIsLoading(false);
      });
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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const totalPages = Math.ceil(totalLogs / pageSize);

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
    <div className=" min-h-screen">
      <div className=" mx-auto bg-white rounded-lg  overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">API Details</h2>
        {apiData ? (
          <div className="p-6 bg-gray-200 text-black flex flex-col gap-2">
            <div className="flex items-center">
              <span className="text-lg ">Endpoint:</span>
              <span className="text-blue-600 hover:text-blue-700 ml-2">
                {apiData.endpoint}
              </span>
              {/* <FaCopy
                  className="cursor-pointer text-gray-500 ml-2"
                  onClick={handleCopy}
                /> */}
              <Link
                to={`/edit-api/${apiData._id}`}
                className="text-gray-500 hover:text-gray-700 ml-2"
                title="Edit API"
              >
                <AiFillEdit size={18} />
                {/* <FiEdit2 size={18} /> */}
              </Link>
            </div>
            {/* <div className="flex items-center">
              <span className="text-lg">Status:</span>
              <span
                className={`ml-2 ${
                  apiData.status === 1
                    ? "bg-green-500 text-white px-2 py-[.3rem] rounded-md"
                    : "bg-red-500 px-2 py-[.3rem] text-white rounded-md"
                }`}
              >
                {apiData.status === 1 ? "OK" : "NOT OK"}
              </span>
            </div> */}
            <div className="flex items-center">
              <span className="text-lg ">Code:</span>
              <span className="ml-2 text-gray-500">{apiData.code}</span>
              <span
                className={`px-1 inline-flex text-lg leading-5 font-semibold rounded-full mx-2 ${
                  apiData.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {apiData.status ? <FiCheck /> : <FiX />}
              </span>
              |
              <span className="ml-2 text-lg text-gray-500">
                {formatDate(apiData.updated_at)}
              </span>
            </div>
            <button
              onClick={handleHitAndLog}
              disabled={isLoading}
              className={`w-fit mt-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-bold py-1 px-3 rounded  focus:outline-none transition duration-300 ease-in-out`}
            >
              {isLoading ? "Loading..." : "Hit API"}
            </button>
          </div>
        ) : (
          <Loader />
        )}

        <div className="flex gap-8">
          <div className="w-1/3">
            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800">
              API Call Logs
            </h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/8 py-2 px-4 text-left text-gray-600 font-semibold">
                      #
                    </th>
                    <th className="w-2/8 py-2 px-4 text-left text-gray-600 font-semibold">
                      Timestamp
                    </th>
                    <th className="w-2/8 py-2 px-4 text-left text-gray-600 font-semibold">
                      Code
                    </th>
                    <th className="w-2/8 py-2 px-4 text-left text-gray-600 font-semibold">
                      Latency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {logs.map((log, index) => (
                    <tr
                      key={log._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="py-2 px-4">{formatDate(log.timestamp)}</td>
                      <td className="py-2 px-4">{log.status_code || "---"}</td>
                      <td className="py-2 px-4">{log.response_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-6 gap-12">
              <button
                onClick={() => page > 1 && paginate(page - 1)}
                className={`px-3 py-2 bg-gray-200 rounded-md ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={page === 1}
              >
                <FaChevronLeft />
              </button>

              <div className="flex space-x-1">{renderPaginationButtons()}</div>

              <button
                onClick={() =>
                  page < Math.ceil(totalLogs / pageSize) && paginate(page + 1)
                }
                className={`px-3 py-2 bg-gray-200 rounded-md ${
                  page === Math.ceil(totalLogs / pageSize)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={page === Math.ceil(totalLogs / pageSize)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="w-2/3 flex flex-col justify-center items-center pt-12 px-12">
            <div className="relative w-full h-96 bg-white p-4 rounded-lg shadow-lg flex justify-center">
              <Line data={chartData} options={chartOptions} />
            </div>
            <h3 className="text-s font-bold mt-8 mb-4 text-gray-800">
              Response Time Chart
            </h3>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default ViewAPI;
