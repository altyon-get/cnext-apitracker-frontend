import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { adminLogin } from "../redux/slices/adminSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const message = new URLSearchParams(location.search).get("message");

  useEffect(() => {
    if (message) {
      toast.info(message, {
        duration: 3000,
      });
    }
  }, [message]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    setLoading(true);
    try {
      const res = await dispatch(adminLogin({ username, password })).unwrap();
      if (res?.status === 200) {
        navigate("/api-list");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred during login.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <div className="flex items-center p-4 m-4">
        <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
        <span className="text-2xl font-semibold">CAREERS</span> 
        <span className="text-2xl">360</span>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 font-bold text-white rounded-lg ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
