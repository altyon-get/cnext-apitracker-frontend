import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { BASE_URL } from '../constants.js';

const ViewAPI = () => {
  const { id } =useParams();
  const [api, setApi] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}api-list/${id}/`)
      .then(response => setApi(response.data))
      .catch(error => console.error('Error fetching API:', error));

    axios.get(`${BASE_URL}api-list/${id}/call-logs/`)
      .then(response => setLogs(response.data))
      .catch(error => console.error('Error fetching logs:', error));
  }, [id]);

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

  return (
    <div>
      {api && (
        <div>
          <h2 className="text-2xl font-bold mb-4">API Details</h2>
          <p><strong>Endpoint:</strong> {api.api_endpoint}</p>
          <p><strong>Status:</strong> {api.status}</p>
          <p><strong>Code:</strong> {api.code}</p>
          <p><strong>Updated At:</strong> {new Date(api.updated_at).toLocaleString()}</p>
        </div>
      )}

      <h3 className="text-xl font-bold mt-8 mb-4">API Call Logs</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">Response Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.timestamp}>
              <td className="border px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="border px-4 py-2">{log.response_time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-bold mt-8 mb-4">Response Time Graph</h3>
      <Line data={data} />
    </div>
  );
};

export default ViewAPI;