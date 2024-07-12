import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../api/api';
import Loader from '../components/Loader';
import { FaCopy } from 'react-icons/fa';

const ViewAPI = () => {
  const { id } = useParams();
  const [apiData, setApiData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchApiData();
    fetchLogs();
  }, [id, page, pageSize]);

  const fetchApiData = () => {
    api.get(`api/api-list/${id}/`)
      .then(response => setApiData(response.data))
      .catch(error => console.error('Error fetching API:', error));
  };

  const fetchLogs = () => {
    setIsLoading(true);
    api.get(`api/api-list/${id}/call-logs/`, {
      params: { page, page_size: pageSize }
    })
      .then(response => {
        setLogs(response.data.call_logs);
        setTotalLogs(response.data.total_logs);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error fetching logs:', error);
      });
  };

  const handleHitAndLog = () => {
    setIsLoading(true);
    api.get(`api/hit-api/${id}`)
      .then(() => {
        fetchApiData();
        fetchLogs();
      })
      .catch(error => {
        console.error('Error hitting and logging API:', error);
        setIsLoading(false);
      });
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const chartData = useMemo(() => ({
    labels: logs.map(log => formatDate(log.timestamp)),
    datasets: [
      {
        label: 'Response Time',
        data: logs.map(log => log.response_time),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      },
    ],
  }), [logs]);

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 45 }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Response Time (seconds)' }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const totalPages = Math.ceil(totalLogs / pageSize);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {apiData ? (
          <div className="p-6 bg-gray-200 text-black flex gap-2 flex-col">
            <h2 className="text-3xl font-bold mb-4">API Details</h2>
            <p className="text-lg flex  items-center gap-2"><span className="font-semibold">Endpoint:</span>
          <span className='text-blue-600 hover:text-blue-700'>
          {apiData.api_endpoint}
        
          </span>
          <FaCopy className='cursor-pointer text-gray-500' />
            </p>
            <p className="text-lg"><span className={`font-semibold`} >Status:</span> 
            <span className={`ml-2 font-semibold ${apiData.status===1?"bg-green-500 text-white px-2 py-[.3rem] rounded-md":"bg-red-500 text-white rounded-md"}`}>

            {apiData.status===1?"OK":"NOT OK"}
            </span>
            </p>
            <p className="text-lg"><span className="font-semibold">Code:</span> {apiData.code}</p>
            <p className="text-lg"><span className="font-semibold">Updated At:</span> {formatDate(apiData.updated_at)}</p>
          </div>
        ) : (
          <Loader />
        )}

        <div className="p-6">
          <button
            onClick={handleHitAndLog}
            disabled={isLoading}
            className={`${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-3 px-6 rounded-full focus:outline-none transition duration-300 ease-in-out`}
          >
            {isLoading ? 'Loading...' : 'Hit and Log API'}
          </button>

          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">API Call Logs</h3>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Index</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log, index) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(page - 1) * pageSize + index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(log.timestamp)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.response_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition duration-300 ease-in-out`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-md ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white transition duration-300 ease-in-out`}
                >
                  Next
                </button>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-800">Response Time Graph</h3>
              <div className="w-full h-96 bg-white p-4 rounded-lg shadow-lg">
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAPI;