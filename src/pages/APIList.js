import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../constants.js';

const APIList = () => {
  const [apis, setApis] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}api-list/`)
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
    <div>
      <h2 className="text-2xl font-bold mb-4">API List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Index</th>
            <th className="px-4 py-2">API Endpoint</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Updated At</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((api, index) => (
            <tr key={api._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{api.api_endpoint}</td>
              <td className="border px-4 py-2">{api.status}</td>
              <td className="border px-4 py-2">{api.code}</td>
              <td className="border px-4 py-2">{new Date(api.updated_at).toLocaleString()}</td>
              <td className="border px-4 py-2">
                <Link to={`/view-api/${api._id}`} className="text-blue-500 hover:underline">View</Link> | 
                <Link to={`/edit-api/${api._id}`} className="text-blue-500 hover:underline">Edit</Link> | 
                <button className="text-red-500 hover:underline" onClick={() => deleteApi(api._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default APIList;
