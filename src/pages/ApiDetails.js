import React from "react";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FiCheck, FiX } from "react-icons/fi";

const ApiDetails = ({ apiData, handleHitAndLog, isLoading, formatDate }) => {
  return (
    <div className="p-6 bg-gray-200 text-black flex flex-col gap-2">
      <div className="flex items-center">
        <span className="text-lg ">Endpoint:</span>
        <span className="text-blue-600 hover:text-blue-700 ml-2 overflow-x-auto thin-scrollbar">
          {apiData.endpoint}
        </span>
        <Link
          to={`/edit-api/${apiData._id}`}
          className="text-gray-500 hover:text-gray-700 ml-2"
          title="Edit API"
        >
          <AiFillEdit size={18} />
        </Link>
      </div>
      <div className="flex items-center">
        <span className="text-lg ">Code:</span>
        <span className="ml-2 text-gray-500">{apiData.code}</span>
        <span
          className={`px-1 inline-flex text-lg leading-5 font-semibold rounded-full mx-2 ${
            apiData.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {apiData.status ? <FiCheck /> : <FiX />}
        </span>
        |
        <span className="ml-2 text-lg text-gray-500">
          {formatDate(apiData.updated_at)}
        </span>
      </div>
      
    </div>
  );
};

export default ApiDetails;
