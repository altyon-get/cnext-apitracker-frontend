import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAPI = () => {
  const [endpoint, setEndpoint] = useState("");
  const [requestType, setRequestType] = useState("GET");
  const [params, setParams] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (requestType !== "GET" && !params.trim()) {
      errors.params = "Parameters are required for non-GET requests.";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post(`${BASE_URL}api-list/`, {
        endpoint: endpoint,
        request_type: requestType,
        params: params,
      })
      .then(() => {
        toast.success("API added successfully!");
        navigate("/api-list");
      })
      .catch((error) => {
        console.error("Error adding API:", error);
        if (error.response && error.response.data) {
          toast.error(
            error.response.data.message ||
              "An error occurred while adding the API."
          );
        } else {
          toast.error("An error occurred while adding the API.");
        }
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add API</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Endpoint
          </label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.endpoint ? "border-red-500" : ""
            }`}
          />
          {errors.endpoint && (
            <p className="text-red-500 text-xs italic">{errors.endpoint}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Request Type
          </label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Parameters
          </label>
          <input
            type="text"
            value={params}
            onChange={(e) => setParams(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.params ? "border-red-500" : ""
            }`}
          />
          {errors.params && (
            <p className="text-red-500 text-xs italic">{errors.params}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add API
        </button>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default AddAPI;
