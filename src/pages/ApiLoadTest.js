import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import api from "../api/api";
import Loader from '../utils/Loader'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const ApiLoadTest = () => {
  const { id } = useParams();
  const [numUsers, setNumUsers] = useState(10);
  const [duration, setDuration] = useState(2);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const resultsRef = useRef(null);


  const handleRunTest = async () => {
    setTimer(0);
    startTimer();
    setLoading(true);
    try {
      const response = await api.get(`api/api-list/${id}/load-test/`, {
        params: { numUsers, duration },
      });
      const data = response.data;
      const responseData = {
        user_count: data.user_count,
        duration: data.duration,
        status_code: 0,
        lowest_response_time: data.min_response_time,
        highest_response_time: data.max_response_time,
        average_response_time: data.avg_response_time,
        responses: data.responses,
      };
      console.log(response.data, " - load test response");
      setTestResult(responseData);
    } catch (err) {
      console.error(err);
    } finally {
      stopTimer(); 
      setLoading(false);
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(()=>{
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => stopTimer();
  },[]);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const chartData = {
    labels:
      testResult?.responses.map(
        (result) => new Date(result.group_start_time)
      ) || [],
    datasets: [
      {
        label: "Response Time",
        data:
          testResult?.responses.map((result) => ({
            x: new Date(result.group_start_time),
            y: result.response_time.toFixed(3),
            status: result.status_code,
          })) || [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        // backgroundColor: context => context.raw.status === 200 ? "green" : "red",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const status = context.raw.status;
            const label = `Response Time: ${context.raw.y}s, Users: ${numUsers}, Status: ${status}`;
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          tooltipFormat: "MMM dd, yyyy, HH:mm:ss",
        },
        title: { display: true, text: "Group Start Time" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Response Time (seconds)" },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 bg-gray-100  min-h-[852px]" ref={resultsRef}>
      <h3 className="text-xl font-medium mb-4 text-gray-800">Load Test API</h3>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <form className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-gray-700">User Count</label>
            <input
              type="number"
              placeholder="Number of Users"
              value={numUsers}
              onChange={(e) => setNumUsers(Number(e.target.value))}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700">Duration (m)</label>
            <input
              type="number"
              placeholder="Duration (seconds)"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleRunTest}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Running..." : "Run Test"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-gray-700 text-lg">
          {loading && (
            <div>Timer: {formatTime(timer)}</div>
          )}
        </div>
      </div>
      <div className="min-h-[592px] flex items-center">
        {
        loading? <Loader/> : 
        testResult && (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Test Results
            </h3>
            <table className="w-full table-auto border-collapse mb-8">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">User Count</th>
                  <th className="border p-2">Duration (m)</th>

                  <th className="border p-2">Avg Response Time (s)</th>
                  <th className="border p-2">Lowest Response Time (s)</th>
                  <th className="border p-2">Highest Response Time (s)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border p-2">{testResult.user_count}</td>
                  <td className="border p-2">{testResult.duration}</td>

                  <td className="border p-2">
                    {testResult.average_response_time.toFixed(3)}
                  </td>
                  <td className="border p-2">
                    {testResult.lowest_response_time.toFixed(3)}
                  </td>
                  <td className="border p-2">
                    {testResult.highest_response_time.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="relative w-full h-96 bg-white p-4 rounded-lg shadow-lg flex justify-center">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )
        }
      </div>
    </div>
  );
};

export default ApiLoadTest;
