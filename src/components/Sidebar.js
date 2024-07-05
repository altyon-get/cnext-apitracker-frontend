import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  
  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">API Tracker</h1>
      </div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link to="/api-list" className="block px-6 py-2 hover:bg-gray-700">API List</Link>
          </li>
          <li>
            <Link to="/add-api" className="block px-6 py-2 hover:bg-gray-700">Add API to API List</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
