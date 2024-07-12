import React from "react";
import { Link } from "react-router-dom";
import { FiList, FiPlus, FiLogIn, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutAdmin } from "../redux/slices/adminSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOutAdmin());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">API Tracker</h1>
      </div>
      <nav className="mt-6 flex-1">
        <ul>
          <li>
            <Link
              to="/api-list"
              className="block px-6 py-3 flex items-center hover:bg-gray-700"
            >
              <FiList className="mr-2" /> API List
            </Link>
          </li>
          <li>
            <Link
              to="/add-api"
              className="block px-6 py-3 flex items-center hover:bg-gray-700"
            >
              <FiPlus className="mr-2" /> Add API to List
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-6">
        <ul>
          <li className="mb-4">
            {/* {isAuthenticated() ? (
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            ) : (
              <Link to="/login" className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center">
                <FiLogIn className="mr-2" /> Login
              </Link>
            )} */}
            {localStorage.getItem("token") ? (
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
              >
                <FiLogIn className="mr-2" /> Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
