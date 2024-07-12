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

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    console.log("fetch api calling...");
    setIsLoading(true);
    try {
      const response = await api.get("api/api-list/");
      setApis(response.data);
    } catch (error) {
      console.error("Error fetching APIs:", error);
      toast.error(`Failed to fetch list: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   setInterval(()=>{
  //     fetchApis();
  //   },10000)
  // },[])

  const deleteApi = async (id) => {
    try {
      await axios.delete(`${BASE_URL}api-list/${id}/`);
      setApis((prevApis) => prevApis.filter((api) => api._id !== id));
      toast.success("API deleted successfully");
    } catch (error) {
      console.error("Error deleting API:", error);
      toast.error(`Failed to delete API: ${error.message}`);
    }
  };

  const filteredApis = useMemo(() => {
    return apis.filter((api) => {
      const matchesSearch = api.api_endpoint
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
    const pageNumbers = Math.ceil(filteredApis.length / itemsPerPage);
    const buttons = [];

    for (let i = 1; i <= pageNumbers; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentPage === i
              ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          }`}
        >
          {i}
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
                    API Endpoint
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
                    <td className="border-t-0 px-6 py-4">{api.api_endpoint}</td>
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
                        to={`/edit-api/${api._id}`}
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
          <div className="py-3 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastItem >= filteredApis.length}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredApis.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredApis.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {renderPaginationButtons()}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastItem >= filteredApis.length}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
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
