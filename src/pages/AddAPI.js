import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';

const AddAPI = () => {
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [requestType, setRequestType] = useState('GET');
  const [params, setParams] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post(`${BASE_URL}api-list/`, {
      api_endpoint: apiEndpoint,
      request_type: requestType,
      params: params,
    })
    .then(() => {
      setIsLoading(false);
      toast.success('API added successfully!');
      navigate('/api-list');
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error adding API:', error);
      toast.error('Failed to add API. Please try again.');
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Add API</h2>
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
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : 'Add API'}
        </button>
      </form>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddAPI;
