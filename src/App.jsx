import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BillingSystem from "./BillingSystem";
import BillHistory from "./BillHistory";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-50">
        <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
          {/* Home Button */}
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 hover:text-blue-800"
          >
            Billing System
          </Link>

          {/* Bill History Button */}
          <Link
            to="/history" // Match this to the defined route path
            className="text-lg font-semibold text-gray-600 hover:text-gray-800"
          >
            Bill History
          </Link>
        </nav>

        {/* Define Routes */}
        <Routes>
          {/* Billing Page */}
          <Route path="/" element={<BillingSystem />} />
          {/* Bill History Page */}
          <Route path="/history" element={<BillHistory />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
