import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import Loader from "../utils/Loader";
import ConfirmationModal from "../components/ConfirmationModal";

const APIList = ({ openModal }) => {
  const [apis, setApis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalApis, setTotalApis] = useState(0);

  useEffect(() => {
    fetchApis();
  }, [currentPage]);

  const fetchApis = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("api/api-list/", {
        params: {
          page: currentPage,
          page_size: itemsPerPage,
        },
      });
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
      await api.delete(`api/api-list/${id}/`);
      toast.success("API deleted successfully");
      fetchApis();
    } catch (error) {
      toast.error(`Failed to delete API: ${error.message}`);
    }
  };

  const handleDeleteClick = (id) => {
    openModal(
      "Confirm Delete",
      "Do you really want to delete this API?",
      "APIList",
      () => {
        deleteApi(id);
      }
    );
  };

  const getHighlightedText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
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

  const filteredAndSortedApis = useMemo(() => {
    return apis
      .filter((api) =>
        api.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "desc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "desc" ? 1 : -1;
        return 0;
      });
  }, [apis, searchTerm, sortBy, sortOrder]);


  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, HH:mm");
  };

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

  const navigate = useNavigate();
  const handleRowClick = (apiId) => {
    navigate(`/view-api/${apiId}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">API List</h2>

      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search APIs..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-2/3 flex flex-wrap justify-end items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mr-2 px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="updated_at">Sort by Last Updated</option>
            <option value="endpoint">Sort by Endpoint</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 bg-gray-200 rounded-md flex items-center justify-center"
          >
            {sortOrder === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between h-full">
      
      {isLoading ? (
        <Loader />
      ) : filteredAndSortedApis.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">
            No APIs found. Please add some APIs or adjust your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-gray-100 border-b-2 border-gray-300">
                  <th className="w-1/24 py-2  px-2 text-left text-gray-600 font-normal">
                    #
                  </th>
                  <th className="w-7/12 py-2  text-left text-gray-600 font-normal ">
                    Endpoint
                  </th>
                  <th className="w-1/12 py-2 px-2 text-left text-gray-600 font-normal">
                    Method
                  </th>
                  <th className="w-1/12 py-2 px-2 text-left text-gray-600 font-normal">
                    Status
                  </th>
                  <th className="w-1/12 py-2 px-2 text-left text-gray-600  font-normal">
                    Code
                  </th>
                  <th className="w-1/12 py-2 px-2 text-left text-gray-600  font-normal">
                    Latency(s)
                  </th>
                  <th className="w-1/12 py-2 px-2 text-left text-gray-600  font-normal">
                    Updated
                  </th>
                  <th className="w-1/12 py-2 px-2 text-left text-gray-600 font-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredAndSortedApis.map((api, index) => (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(api._id)}
                    key={api._id}
                  >
                    <td className="py-2 px-2 text-sm">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td
                      className="py-2  max-w-[200px] overflow-x-auto thin-scrollbar text-sm"
                    >
                      {getHighlightedText(api.endpoint, searchTerm)}
                    </td>
                    <td
                      className={`py-2 px-4 flex text-sm ${
                        api.method === "GET"
                          ? "text-green-400 font-semibold"
                          : api.method === "POST"
                          ? "text-blue-400 font-semibold"
                          : api.method === "PUT"
                          ? "text-yellow-600 font-semibold"
                          : api.method === "DELETE"
                          ? "text-red-300 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {api.method}
                    </td>
                    <td className="py-2 px-4 ">
                      <span
                        className={`px-2 inline-flex text-s leading-5 font-semibold rounded-full ${
                          api.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {api.status ? <FiCheck /> : <FiX />}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm  ">{api.code || "-"}</td>
                    <td className="py-2 px-4 text-sm ">{api.response_time}</td>
                    <td className="py-2 px-2 text-sm">
                      {formatDate(api.updated_at)}
                    </td>
                    <td className="py-2 px-2 flex space-x-4 my-2">
                      <Link
                        to={`/edit-api/${api._id}`}
                        className="text-gray-500 hover:text-gray-700"
                        title="Edit API"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AiFillEdit size={18} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(api._id);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        title="Delete API"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="flex justify-center items-center mt-6 gap-12">
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          className={`px-3 py-2 bg-gray-200 rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        <div className="flex space-x-1">{renderPaginationButtons()}</div>

        <button
          onClick={() =>
            currentPage < Math.ceil(totalApis / itemsPerPage) &&
            paginate(currentPage + 1)
          }
          className={`px-3 py-2 bg-gray-200 rounded-md ${
            currentPage === Math.ceil(totalApis / itemsPerPage)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={currentPage === Math.ceil(totalApis / itemsPerPage)}
        >
          <FaChevronRight />
        </button>
      </div>
      </div>
    </div>
  );
};

export default APIList;
