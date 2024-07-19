import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const EditAPI = () => {
  const { id } = useParams();
  const [endpoint, setEndpoint] = useState("");
  const [requestType, setRequestType] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      .get(`/api/api-list/${id}/`)
      .then((response) => {
        const api = response.data;
        setEndpoint(api.endpoint);
        setRequestType(api.method);
        setHeaders(
          api.headers && Object.keys(api.headers).length > 0
            ? Object.entries(api.headers).map(([key, value]) => ({
                key,
                value,
              }))
            : [{ key: "", value: "" }]
        );
        setParams(
          api.params && Object.keys(api.params).length > 0
            ? Object.entries(api.params).map(([key, value]) => ({ key, value }))
            : [{ key: "", value: "" }]
        );
        setBody(
          api.body
            ? typeof api.body === "object"
              ? JSON.stringify(api.body, null, 2)
              : api.body
            : ""
        );
      })
      .catch((error) => console.error("Error fetching API:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    const payload = {
      endpoint: endpoint,
      method: requestType,
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
      .catch((error) => toast.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit API</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <>
          <div className="flex mb-4">
            <div className="pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Method
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
              className={
                'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline rows="5" '
              }
            />
          </div>
        </>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Saving...." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default EditAPI;
