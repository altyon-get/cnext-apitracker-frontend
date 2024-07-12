// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../components/AuthenticationContext'; // Import useAuth hook

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth(); // Use login method from auth context

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/login/', new URLSearchParams({
//         username,
//         password
//       }), {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
//       const token = response.data.token;
//       localStorage.setItem('token', token);
//       login(username, token); // Store user info (optional) and token in context
//       navigate('/api-list');
//     } catch (error) {
//       console.error('Login error:', error);
//       // Handle login error (show toast message, etc.)
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="submit"
//           >
//             Sign In
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading, error: loginError } = useSelector((state) => state.admin);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await dispatch(adminLogin({ username, password })).unwrap();
      if (res?.status === 200) {
        navigate("/api-list");
      }
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleFormSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Admin Login
          </h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              UserName
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="text"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                
              `}
              type="submit"
              // disabled={loading}
            >
              {/* {loading ? "Logging in..." : "Login"} */}
              Login
            </button>
          </div>
          {/* {(error || loginError) && (
            <p className="text-red-500 text-xs italic mt-4">
              {error || loginError}
            </p>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default Login;
