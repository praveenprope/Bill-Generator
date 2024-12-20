import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai"; // For delete icon
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // For expand/collapse icons
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const BillHistory = () => {
  const [billHistory, setBillHistory] = useState([]);
  const [expandedBillIndex, setExpandedBillIndex] = useState(null);

  useEffect(() => {
    const storedBills = JSON.parse(localStorage.getItem("billHistory")) || [];
    setBillHistory(storedBills);
  }, []);

  const deleteBill = (index) => {
    const updatedBills = [...billHistory];
    updatedBills.splice(index, 1); 
    setBillHistory(updatedBills);
    localStorage.setItem("billHistory", JSON.stringify(updatedBills));
  };

  const toggleBillDetails = (index) => {
    setExpandedBillIndex(expandedBillIndex === index ? null : index); 
  };

  const generatePDF = (bill) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Store Billing Receipt", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Customer: ${bill.username}`, 20, 30);
    doc.text(`Phone: ${bill.phoneNumber}`, 20, 40);
    doc.text(`Date: ${bill.date}`, 20, 50);

    const tableColumn = [
      "Product",
      "Price per Quantity (₹)",
      "Price per Kg (₹)",
      "Quantity",
      "Total Price (₹)",
    ];
    const tableRows = bill.cartItems.map((item) => [
      item.product,
      item.pricePerQuantity,
      item.pricePerKg,
      item.quantity,
      item.totalPrice.toFixed(2),
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 60 });
    doc.text(`Total Amount: ₹${bill.totalAmount.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);

    doc.save(`${bill.username}_bill_${Date.now()}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600">Bill History</h1>
      
      {billHistory.length === 0 ? (
        <p className="text-center text-gray-500">No bill history available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Total (₹)</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {billHistory.map((bill, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td
                      className="px-4 py-2 text-indigo-500 font-semibold"
                      onClick={() => toggleBillDetails(index)}
                    >
                      {bill.username}
                      <span className="ml-2">
                        {expandedBillIndex === index ? (
                          <FaChevronUp className="inline" />
                        ) : (
                          <FaChevronDown className="inline" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-2">{bill.phoneNumber}</td>
                    <td className="px-4 py-2">{bill.date}</td>
                    <td className="px-4 py-2">
                      ₹{bill.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-red-500">
                      <button
                        onClick={() => deleteBill(index)}
                        className="hover:text-red-700 mr-4"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                      <button
                        onClick={() => generatePDF(bill)}
                        className="hover:text-blue-700"
                      >
                        Create PDF
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Details */}
                  {expandedBillIndex === index && (
                    <tr className="bg-gray-100">
                      <td colSpan="5" className="px-4 py-4">
                        <table className="w-full">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="px-4 py-2">Product Name</th>
                              <th className="px-4 py-2">Price (₹)</th>
                              <th className="px-4 py-2">Quantity</th>
                              <th className="px-4 py-2">Total Price (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bill.cartItems.map((item, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="px-4 py-2">{item.product}</td>
                                <td className="px-4 py-2">
                                  ₹{item.pricePerKg !== "N/A" ? item.pricePerKg : item.pricePerQuantity}
                                </td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">₹{item.totalPrice.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillHistory;
