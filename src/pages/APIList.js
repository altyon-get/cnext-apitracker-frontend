import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi'; // Import icons from react-icons
import api from '../api/api';
import { BASE_URL } from '../constants.js';

const APIList = () => {
  const [apis, setApis] = useState([]);

  useEffect(() => {
    api.get('api/api-list/')
      .then(response => setApis(response.data))
      .catch(error => console.error('Error fetching APIs:', error));
  }, []);

  const deleteApi = (id) => {
    axios.delete(`${BASE_URL}api-list/${id}/`)
      .then(() => {
        setApis(prevApis => prevApis.filter(api => api._id !== id));
      })
      .catch(error => console.error('Error deleting API:', error));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">API List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Index</th>
              <th className="py-3 px-6 text-left">API Endpoint</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Code</th>
              <th className="py-3 px-6 text-left">Updated At</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {apis.map((api, index) => (
              <tr key={api._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{api.api_endpoint}</td>
                <td className="py-3 px-6 text-left">{api.status? 'Ok': 'Not OK'}</td>
                <td className="py-3 px-6 text-left">{api.code? api.code:' -'}</td>
                <td className="py-3 px-6 text-left">{new Date(api.updated_at).toLocaleString()}</td>
                <td className="py-3 px-6 text-left">
                  <Link to={`/view-api/${api._id}`} className="text-blue-500 hover:underline mr-2">
                    <FiEye className="inline-block mr-1" /> 
                  </Link>
                  <Link to={`/edit-api/${api._id}`} className="text-yellow-500 hover:underline mr-2">
                    <FiEdit className="inline-block mr-1" /> 
                  </Link>
                  <button onClick={() => deleteApi(api._id)} className="text-red-500 hover:underline">
                    <FiTrash2 className="inline-block mr-1" /> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default APIList;
