import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiList,
  FiPlus,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutAdmin } from "../redux/slices/adminSlice";
import logo from "../logo.png";
import ConfirmationModal from "../components/ConfirmationModal";

const Sidebar = ({ isExpanded, onToggle, openModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logOutAdmin());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogoutClick = () => {
    openModal("Confirm Logout", "Do you really want to logout?", "Sidebar", () => {
      handleLogout();
    });
  };

  return (
    <div
      className={`h-screen flex flex-col ${
        isExpanded ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300 relative`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span
            className={`text-2xl font-bold transition-all duration-300 whitespace-nowrap ${
              isExpanded ? "block" : "hidden"
            }`}
          >
            API Tracker
          </span>
        </div>
        <button
          onClick={onToggle}
          className="focus:outline-none absolute right-0 transform translate-x-1/3 bg-gray-800 p-2 rounded-full"
        >
          {isExpanded ? (
            <FiChevronLeft className="text-2xl" />
          ) : (
            <FiChevronRight className="text-2xl" />
          )}
        </button>
      </div>
      <nav className="mt-6 flex-1">
        <ul>
          <li>
            <Link
              to="/api-list"
              className={`block px-6 py-3 flex items-center transition duration-200 ${
                location.pathname === "/api-list"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <FiList className="mr-2" />{" "}
              <span
                className={`transition-all duration-300 whitespace-nowrap  ${
                  isExpanded ? "block" : "hidden"
                }`}
              >
                API List
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/add-api"
              className={`block px-6 py-3 flex items-center whitespace-nowrap transition duration-200 ${
                location.pathname === "/add-api"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <FiPlus className="mr-2" />{" "}
              <span
                className={`transition-all duration-300 ${
                  isExpanded ? "block" : "hidden"
                }`}
              >
                Add API
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-6">
        <ul>
          <li className="mb-4">
            <button
              onClick={handleLogoutClick}
              className={`block w-full bg-red-500 hover:bg-red-700 transition duration-200 text-white font-bold py-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center ${
                isExpanded ? "px-3" : "px-0"
              }`}
            >
              <FiLogOut className={`${isExpanded ? "mr-1" : "mr-0"}`} />
              <span
                className={`transition-all duration-300 ${
                  isExpanded ? "block" : "hidden"
                }`}
              >
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
