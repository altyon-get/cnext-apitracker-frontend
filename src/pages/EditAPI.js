import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const EditAPI = () => {
  const { id } = useParams();
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const addField = (setter) => {
    setter((prev) => [...prev, { key: "", value: "" }]);
  };

  const updateField = (setter, index, field, value) => {
    setter((prev) => {
      const newFields = [...prev];
      newFields[index][field] = value;
      return newFields;
    });
  };

  const removeField = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    api
      .get(`/api/apis/${id}/`)
      .then((response) => {
        const api = response.data;
        setEndpoint(api.endpoint);
        setMethod(api.method);
        setHeaders(api.headers || [{ key: "", value: "" }]);
        setParams(api.params || [{ key: "", value: "" }]);
        setBody(api.body || "");
      })
      .catch((error) => console.error("Error fetching API:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      endpoint: endpoint,
      method: method,
    };

    if (headers.some((header) => header.key !== "" && header.value !== "")) {
      payload.headers = headers;
    }

    if (params.some((param) => param.key !== "" && param.value !== "")) {
      payload.params = params;
    }

    if (body.trim() !== "") {
      payload.body = body;
    }

    api
      .put(`/api/api-list/${id}/`, payload)
      .then(() => {
        navigate("/api-list");
      })
      .catch((error) => console.error("Error updating API:", error));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-left text-gray-600 text-2xl">Edit api</h1>
      <form onSubmit={handleSubmit}>
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
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
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
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setHeaders)}
            className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Add Header
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
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setParams)}
            className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Add Parameter
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditAPI;
