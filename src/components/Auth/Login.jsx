import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Login = ({ setIsLoggedIn }) => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user by Gmail and Password
    const user = users.find(
      (user) => user.gmail === gmail && user.password === password
    );

    if (user) {
      alert(`Welcome back, ${user.name}!`);

      // Set login status to "true" (as string)
      localStorage.setItem("isLoggedIn", "true");

      // Get the shopName from the matched user
      const shopName = user.shopName;

      // Store the shopName in localStorage for future use
      localStorage.setItem("shopName", shopName);
      console.log(`Shop Name: ${shopName}`); // Log the retrieved shop name

      // Update local state and navigate
      setIsLoggedIn(true); // Update local state
      navigate("/"); // Redirect to Billing System
    } else {
      alert("Invalid Gmail or Password!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <div className="mb-4 relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="block w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-6 relative">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
        >
          <FaSignInAlt className="mr-2" /> Login
        </button>
        <p className="mt-4 text-center text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/create-account")}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            <FaUserPlus className="inline-block mr-1" /> Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
