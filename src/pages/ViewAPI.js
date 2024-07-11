import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import api from '../api/api';
import Loader from '../components/Loader';

const ViewAPI = () => {
  const { id } = useParams();
  const [apiData, setApiData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      params: {
        page: page,
        page_size: pageSize,
      }
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
        setIsLoading(false);
        console.error('Error hitting and logging API:', error);
      });
  };

  const data = {
    labels: logs.map(log => new Date(log.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Response Time',
        data: logs.map(log => log.response_time),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Response Time (seconds)',
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalLogs / pageSize);

  const paginationNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationNumbers.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${page === i ? 'bg-gray-300' : ''}`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {apiData ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">API Details</h2>
          <p><strong>Endpoint:</strong> {apiData.api_endpoint}</p>
          <p><strong>Status:</strong> {apiData.status}</p>
          <p><strong>Code:</strong> {apiData.code}</p>
          <p><strong>Updated At:</strong> {new Date(apiData.updated_at).toLocaleString()}</p>
        </div>
      ) : (
        <Loader />
      )}

      <button
        onClick={handleHitAndLog}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        {isLoading ? 'Loading...' : 'Hit and Log API'}
      </button>

      <h3 className="text-xl font-bold mt-8 mb-4">API Call Logs</h3>
      {isLoading ? (
        <Loader />
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="border px-4 py-2">{log.response_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline ${page === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Previous
        </button>
        {paginationNumbers}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline ${page === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Next
        </button>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Response Time Graph</h3>
      <div className="w-full h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ViewAPI;
