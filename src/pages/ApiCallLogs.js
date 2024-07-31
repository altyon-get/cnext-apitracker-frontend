import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../utils/Loader";

const ApiCallLogs = ({
  logs,
  page,
  pageSize,
  totalLogs,
  paginate,
  handleHitAndLog,
  isLoadingHitAPI,
  formatDate,
  isLoading,
  renderPaginationButtons,
  chartData,
  chartOptions,
}) => {
  return (
    <div className="flex gap-8 mt-4">
      <div className="w-1/3 flex flex-col gap-2">
        <button
          onClick={handleHitAndLog}
          disabled={isLoadingHitAPI}
          className={`w-fit ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-bold py-1 px-3 rounded  focus:outline-none transition duration-300 ease-in-out`}
        >
          Hit API
        </button>

        <h3 className="text-xl font-medium text-gray-800 mt-2">API Call Logs</h3>
        <div className="flex flex-col">
          
          <div className="overflow-x-auto bg-white rounded-lg overflow-y-auto min-h-[490px]">
            {isLoading || false ? (
              <div className="flex items-center h-full">
                <Loader />
              </div>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/8 py-2 px-4 text-left text-gray-600 font-normal">
                      #
                    </th>
                    <th className="w-2/8 py-2 px-4 text-left text-gray-600 font-normal">
                      Timestamp
                    </th>
                    <th className="w-2/8 py-2 px-4 text-left text-gray-600 font-normal">
                      Code
                    </th>
                    <th className="w-2/8 py-2 px-4 text-left text-gray-600 font-normal">
                      Latency(s)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {logs.map((log, index) => (
                    <tr
                      key={log._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-4 text-sm">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="py-2 px-4 text-sm">{formatDate(log.timestamp)}</td>
                      <td className="py-2 px-4 text-sm">{log.status_code || "---"}</td>
                      <td className="py-2 px-4 text-sm">{log.response_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          
          <div className="flex justify-center items-center gap-12">
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
  );
};

export default ApiCallLogs;
