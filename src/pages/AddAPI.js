import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaPlus, FaTrash, FaChevronDown } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api.js";

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
          endpoint: endpoint,
          method: requestType,
          headers: headers.filter((h) => h.key && h.value),
          params: params.filter((p) => p.key && p.value),
          body: body,
        };
        await api.post("api/api-list/", data);
        toast.success("API added successfully!");
      } else {
        const fileReader = new FileReader();
        const jsonData = await new Promise((resolve, reject) => {
          fileReader.onload = (e) => resolve(JSON.parse(e.target.result));
          fileReader.onerror = (error) => reject(error);
          fileReader.readAsText(jsonFile);
        });
        data = jsonData;
        await api.post("api/upload-json/", data);
        toast.success("File uploaded successfully!");
      }

      navigate("/api-list");
    } catch (error) {
    
      console.error("Error adding API:", error);
      toast.error(
        error.response?.data?.error ||
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

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const renderManualEntryForm = () => (
    <>
      <div className="flex mb-4">
        <div className="pr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Request Type
          </label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="shadow border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="w-full pl-2">
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
            <p className="text-red-500 text-xs ">{errors.endpoint}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Headers
        </label>

        {headers.map((header, index) => (
          <div key={index} className="flex mb-2 items-center">
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
            {index === headers.length - 1 ? (
              <button
                type="button"
                onClick={() => addField(setHeaders)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded flex items-center justify-center"
              >
                <FaPlus className="text-sm" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeField(setHeaders, index)}
                className="text-gray-500 py-2 px-3 rounded flex items-center justify-center"
              >
                <FaTrash className="text-sm" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Parameters
        </label>
        {params.map((param, index) => (
          <div key={index} className="flex mb-2 items-center">
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
            {index === params.length - 1 ? (
              <button
                type="button"
                onClick={() => addField(setParams)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded flex items-center justify-center"
              >
                <FaPlus className="text-sm" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removeField(setParams, index)}
                className="text-gray-500 py-2 px-3 rounded flex items-center justify-center"
              >
                <FaTrash className="text-sm" />
              </button>
            )}
          </div>
        ))}
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
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add API</h2>
      <div className="mb-4">
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              value="manual"
              checked={addMethod === "manual"}
              onChange={() => setAddMethod("manual")}
              className="form-radio"
            />
            <span className="ml-2">Manual Entry</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="json"
              checked={addMethod === "json"}
              onChange={() => setAddMethod("json")}
              className="form-radio"
            />
            <span className="ml-2">Upload JSON</span>
          </label>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {addMethod === "manual"
          ? renderManualEntryForm()
          : renderJsonUploadForm()}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Add API
        </button>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddAPI;
