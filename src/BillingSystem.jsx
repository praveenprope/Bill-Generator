import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const BillingSystem = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [pricePerQuantity, setPricePerQuantity] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showBillForm, setShowBillForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && /^[0-9]*$/.test(value)) {
      setPhoneNumber(value.length <= 10 ? value : phoneNumber);
    } else {
      switch (name) {
        case "username":
          setUsername(value);
          break;
        case "productName":
          setProductName(value);
          break;
        case "quantity":
          setQuantity(value);
          break;
        case "pricePerKg":
          setPricePerKg(value);
          break;
        case "pricePerQuantity":
          setPricePerQuantity(value);
          break;
        default:
          break;
      }
    }
  };

  const startBilling = () => {
    if (!username || !phoneNumber) {
      alert("Please enter both Customer Name and Phone Number to proceed.");
      return;
    }
    if (phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    setShowBillForm(true);
  };

  const addToCart = () => {
    if (!productName || (!pricePerKg && !pricePerQuantity) || !quantity) {
      alert("Please fill all required fields.");
      return;
    }

    let totalPrice = 0;
    if (pricePerKg) totalPrice = parseFloat(pricePerKg) * parseFloat(quantity);
    else if (pricePerQuantity)
      totalPrice = parseFloat(pricePerQuantity) * parseFloat(quantity);

    if (totalPrice <= 0) {
      alert("Invalid quantity or price!");
      return;
    }

    const newItem = {
      product: productName,
      pricePerKg: pricePerKg || "N/A",
      pricePerQuantity: pricePerQuantity || "N/A",
      quantity,
      totalPrice,
    };

    if (editIndex !== null) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[editIndex] = newItem;
      setCartItems(updatedCartItems);
      setEditIndex(null);
    } else {
      setCartItems([...cartItems, newItem]);
    }

    setTotalAmount(
      cartItems.reduce((acc, item) => acc + item.totalPrice, totalPrice)
    );

    setProductName("");
    setQuantity("");
    setPricePerKg("");
    setPricePerQuantity("");
  };

  const saveBill = () => {
    if (totalAmount === 0) {
      alert("Total amount is 0. Cannot save the bill.");
      return;
    }

    const newBill = {
      username,
      phoneNumber,
      cartItems,
      totalAmount,
      date: new Date().toLocaleString(),
    };

    // Save to localStorage
    try {
      const billHistory = JSON.parse(localStorage.getItem("billHistory")) || [];
      billHistory.push(newBill);
      localStorage.setItem("billHistory", JSON.stringify(billHistory));
      generatePDF(newBill);

      // Reset form and state
      setCartItems([]);
      setTotalAmount(0);
      setUsername("");
      setPhoneNumber("");
      setShowBillForm(false);

      alert("Bill saved successfully!");
    } catch (error) {
      console.error("Error saving bill to localStorage:", error);
      alert("An error occurred while saving the bill. Please try again.");
    }
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-extrabold text-center text-indigo-600">Store Billing System</h1>

      {!showBillForm && (
        <div className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700">Customer Name</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
              className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
              maxLength="10"
            />
          </div>
          <button
            onClick={startBilling}
            className="w-full py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Start Billing
          </button>
        </div>
      )}

      {showBillForm && (
        <>
          <div className="space-y-6">
            <div>
              <label className="font-semibold text-gray-700">Product Name</label>
              <input
                type="text"
                name="productName"
                value={productName}
                onChange={handleInputChange}
                className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700">Price Per Kg (₹)</label>
                <input
                  type="number"
                  name="pricePerKg"
                  value={pricePerKg}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter price per kg"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Price Per Quantity (₹)</label>
                <input
                  type="number"
                  name="pricePerQuantity"
                  value={pricePerQuantity}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter price per quantity"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Quantity</label>
              <input
                type="text"
                name="quantity"
                value={quantity}
                onChange={handleInputChange}
                className="w-full p-4 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            <button
              onClick={addToCart}
              className="w-full py-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              {editIndex !== null ? "Update Product" : "Add Product"}
            </button>
          </div>

          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-700">Cart</h2>
            <table className="w-full mt-4 border-collapse table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-4">Product</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total (₹)</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="bg-gray-50">
                    <td className="p-4">{item.product}</td>
                    <td className="p-4">{item.pricePerQuantity || item.pricePerKg}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{item.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setProductName(item.product);
                          setQuantity(item.quantity);
                          setPricePerKg(item.pricePerKg);
                          setPricePerQuantity(item.pricePerQuantity);
                          setEditIndex(index);
                        }}
                        className="text-yellow-400 hover:text-yellow-500"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6 text-gray-700">
              <h3 className="text-xl font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
              <button
                onClick={saveBill}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Save Bill
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingSystem;
