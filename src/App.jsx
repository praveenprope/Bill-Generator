import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import BillingSystem from "./BillingSystem";
import BillHistory from "./BillHistory";
import Login from "./components/Auth/Login";
import CreateAccount from "./components/Auth/CreateAccount";

const App = () => {
  // Manage the logged-in state and shopName in App component.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    // Check login state and shopName on component mount
    const loginState = JSON.parse(localStorage.getItem("isLoggedIn"));
    const storedShopName = localStorage.getItem("shopName");
    if (loginState) {
      setIsLoggedIn(loginState);
    }
    if (storedShopName) {
      setShopName(storedShopName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("shopName"); // Clear shopName on logout
    setIsLoggedIn(false); // Update local state
    setShopName(""); // Clear shopName state
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            Billing System
          </Link>

          {isLoggedIn && (
            <div className="flex items-center">
              <span className="mr-4 text-lg font-semibold text-gray-600">
                Welcome, {shopName || "User"}
              </span>
              <Link to="/history" className="text-lg font-semibold text-gray-600 hover:text-gray-800">
                Bill History
              </Link>
            </div>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-lg font-semibold text-red-500 hover:text-red-700 ml-4"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-lg font-semibold text-blue-500 hover:text-blue-700 ml-4"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <BillingSystem shopName={shopName} /> : <Navigate to="/login" />}
          />

          <Route
            path="/history"
            element={isLoggedIn ? <BillHistory shopName={shopName} /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setShopName={setShopName} />
              )
            }
          />

          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
