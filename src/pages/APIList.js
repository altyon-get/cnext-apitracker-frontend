import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants.js";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const APIList = () => {
  const [apis, setApis] = useState([]);
  const [filteredApis, setFilteredApis] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    endpoint: "",
    status: "",
    code: "",
  });

  const fetchApisList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api-list/`);
      setApis(response.data);
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching APIs:", error);
    }
  };

  useEffect(() => {
    fetchApisList();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [apis, filters]);

  const deleteApi = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api-list/${id}/`);
      setApis((prevApis) => prevApis.filter((api) => api._id !== id));
    } catch (error) {
      console.error("Error deleting API:", error);
    }
  };

  const applyFilters = () => {
    let result = apis;
    if (filters.endpoint) {
      result = result.filter((api) =>
        api.api_endpoint.toLowerCase().includes(filters.endpoint.toLowerCase())
      );
    }
    if (filters.status) {
      result = result.filter(
        (api) => api.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    if (filters.code) {
      result = result.filter((api) => api.code.toString() === filters.code);
    }
    setFilteredApis(result);
    setTotalPages(Math.ceil(result.length / rowsPerPage));
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold mb-6">API List</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <input
          className="px-3 py-2 border rounded"
          placeholder="Filter by Endpoint"
          name="endpoint"
          value={filters.endpoint}
          onChange={handleFilterChange}
        />
        <select
          className="px-3 py-2 border rounded"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          className="px-3 py-2 border rounded"
          placeholder="Filter by Code"
          name="code"
          value={filters.code}
          onChange={handleFilterChange}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Index
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                API Endpoint
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Code
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Updated At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApis
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((api, index) => (
                <tr key={api._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {api.api_endpoint}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {api.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {api.code}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(api.updated_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex flex-row gap-3 flex-wrap">
                    <Link
                      to={`/view-api/${api._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      <FaEye className="inline" />
                    </Link>
                    <Link
                      to={`/edit-api/${api._id}`}
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                    >
                      <FaEdit className="inline" />
                    </Link>
                    <button
                      onClick={() => deleteApi(api._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1  text-gray-800  disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="px-3 py-1 border-t border-b bg-white">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-gray-800  disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default APIList;
