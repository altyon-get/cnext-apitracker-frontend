import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../api/api";
import { BASE_URL } from "../constants";
import Loader from "../components/Loader";

const APIList = () => {
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalApis, setTotalApis] = useState(0);

  useEffect(() => {
    fetchApis();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchApis = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${BASE_URL}api-list/`, {
        params: {
          currentPage,
          page_size: itemsPerPage,
        },
      });
      console.log(response?.data?.data, 'sadfdsafsdad')
      setApis(response?.data?.data);
      setTotalApis(response?.data?.total);
    } catch (error) {
      toast.error(`Failed to fetch list: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApi = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api-list/${id}/`);
      setApis((prevApis) => prevApis.filter((api) => api._id !== id));
      toast.success("API deleted successfully");
      fetchApis();
    } catch (error) {
      toast.error(`Failed to delete API: ${error.message}`);
    }
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredApis = useMemo(() => {
    return apis.filter((api) => {
      const matchesSearch = api.endpoint
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [apis, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApis.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const pageNumbers = Math.ceil(totalApis / itemsPerPage);
    const maxVisibleButtons = 5;
    const buttons = [];

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(pageNumbers, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="start"
          onClick={() => paginate(1)}
          className="pagination-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pageNumbers) {
      if (endPage < pageNumbers - 1) {
        buttons.push(<span key="end-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key="end"
          onClick={() => paginate(pageNumbers)}
          className="pagination-button"
        >
          {pageNumbers}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">API List</h2>

      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search APIs..."
            className="w-full px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-2/3 flex flex-wrap justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mr-2 px-3 py-2 border rounded-md"
          >
            <option value="updated_at">Sort by Last Updated</option>
            <option value="endpoint">Sort by Endpoint</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 bg-gray-200 rounded-md"
          >
            {sortOrder === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : filteredApis.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            No APIs found. Please add some APIs or adjust your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
            <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
              <thead>
                <tr className="text-left">
                  <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                    Index
                  </th>
                  <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                    Endpoint
                  </th>
                  <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                    Status
                  </th>
                  <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                    Code
                  </th>
                  <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                    Updated At
                  </th>
                  <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((api, index) => (
                  <tr key={api._id} className="text-gray-700">
                    <td className="border-t-0 px-6 py-4 whitespace-no-wrap">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="border-t-0 px-6 py-4">
                      {getHighlightedText(api.endpoint, searchTerm)}
                    </td>
                    <td className="border-t-0 px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          api.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {api.status ? "OK" : "Not OK"}
                      </span>
                    </td>
                    <td className="border-t-0 px-6 py-4">{api.code || "-"}</td>
                    <td className="border-t-0 px-6 py-4">
                      {new Date(api.updated_at).toLocaleString()}
                    </td>
                    <td className="border-t-0 px-6 py-4 whitespace-no-wrap">
                      <Link
                        to={`/view-api/${api._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEye className="inline-block" size={18} />
                      </Link>
                      <Link
                        to={{
                          pathname: `/edit-api/${api._id}`,
                          state: { api },
                        }}
                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                      >
                        <FiEdit className="inline-block" size={18} />
                      </Link>
                      <button
                        onClick={() => deleteApi(api._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline-block" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex-1 text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, totalApis)} of {totalApis} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastItem >= totalApis}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default APIList;
