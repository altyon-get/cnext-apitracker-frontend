import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash, FaChevronDown } from "react-icons/fa";
import api from '../api/api.js';

const AddAPI = () => {
  const [addMethod, setAddMethod] = useState("manual");
  const [endpoint, setEndpoint] = useState("");
  const [requestType, setRequestType] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [jsonFile, setJsonFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateManualEntry = () => {
    const errors = {};
    if (!endpoint.trim()) {
      errors.endpoint = "API Endpoint is required.";
    }
    if (
      requestType !== "GET" &&
      params.length === 1 &&
      !params[0].key &&
      !params[0].value
    ) {
      errors.params = "Parameters are required for non-GET requests.";
    }
    return errors;
  };

  const validateJsonUpload = () => {
    const errors = {};
    if (!jsonFile) {
      errors.jsonFile = "JSON file is required.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors =
      addMethod === "manual" ? validateManualEntry() : validateJsonUpload();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let data;
      if (addMethod === "manual") {
        data = {
          endpoint,
          method: requestType,
          headers: headers.filter((h) => h.key && h.value),
          params: params.filter((p) => p.key && p.value),
          body,
        };
        await api.post('api/api-list/', data);
        toast.success("API added successfully!");
      } else {
        const fileReader = new FileReader();
        const jsonData = await new Promise((resolve, reject) => {
          fileReader.onload = (e) => resolve(JSON.parse(e.target.result));
          fileReader.onerror = (error) => reject(error);
          fileReader.readAsText(jsonFile);
        });
        data = jsonData;
        await api.post('api/upload-json/', data);
        toast.success("File uploaded successfully!");
      }
      
      navigate("/api-list");
    } catch (error) {
      console.error("Error adding API:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the API."
      );
    }
  };

  const addField = (setter) => {
    setter((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeField = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (setter, index, key, value) => {
    setter((prev) => {
      const newFields = [...prev];
      newFields[index][key] = value;
      return newFields;
    });
  };

  const renderManualEntryForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          API Endpoint
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
        <div className="relative">
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
            <FaChevronDown />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Headers
        </label>
        {headers.map((header, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) =>
                updateField(setHeaders, index, "key", e.target.value)
              }
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) =>
                updateField(setHeaders, index, "value", e.target.value)
              }
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
              type="button"
              onClick={() => removeField(setHeaders, index)}
              className="text-red-500 py-2 px-2 rounded"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField(setHeaders)}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Parameters
        </label>
        {params.map((param, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder="Key"
              value={param.key}
              onChange={(e) =>
                updateField(setParams, index, "key", e.target.value)
              }
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <input
              type="text"
              placeholder="Value"
              value={param.value}
              onChange={(e) =>
                updateField(setParams, index, "value", e.target.value)
              }
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
              type="button"
              onClick={() => removeField(setParams, index)}
              className="text-red-500 py-2 px-2 rounded"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField(setParams)}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          <FaPlus />
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
        />
      </div>
    </>
  );

  const renderJsonUploadForm = () => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Upload JSON File
      </label>
      <input
        type="file"
        accept=".json"
        onChange={(e) => setJsonFile(e.target.files[0])}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          errors.jsonFile ? "border-red-500" : ""
        }`}
      />
      {errors.jsonFile && (
        <p className="text-red-500 text-xs italic">{errors.jsonFile}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Add API</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Add Method
        </label>
        <div className="relative">
          <select
            value={addMethod}
            onChange={(e) => setAddMethod(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="manual">Manual Entry</option>
            <option value="json">Upload JSON</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
            <FaChevronDown />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {addMethod === "manual" ? renderManualEntryForm() : renderJsonUploadForm()}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add API
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddAPI;
