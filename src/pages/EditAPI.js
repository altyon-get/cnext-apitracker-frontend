import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditAPI = () => {
  const { id } = useParams();
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [requestType, setRequestType] = useState('GET');
  const [params, setParams] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/api-list/${id}/`)
      .then(response => {
        const api = response.data;
        setApiEndpoint(api.api_endpoint);
        setRequestType(api.request_type);
        setParams(api.params);
      })
      .catch(error => console.error('Error fetching API:', error));
  }, [id]);
  console.log(params)

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/apis/${id}/`, {
      api_endpoint: apiEndpoint,
      request_type: requestType,
      params: params,
    })
    .then(() => {
      navigate('/api-list');
    })
    .catch(error => console.error('Error updating API:', error));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit API</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">API Endpoint</label>
          <input 
            type="text" 
            value={apiEndpoint} 
            onChange={(e) => setApiEndpoint(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Request Type</label>
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Parameters</label>
          <input 
            type="text" 
            value={params} 
            onChange={(e) => setParams(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAPI;
