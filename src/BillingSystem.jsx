import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa"; // Icons for Edit, Delete, and Add

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
  const [priceType, setPriceType] = useState("quantity"); // Price type selection

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

  const handlePriceTypeChange = (e) => {
    setPriceType(e.target.value);
  };

  const startBilling = () => {
    if (!username || !phoneNumber) {
      alert("Please enter all required fields.");
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

    // Ensure quantity and price values are valid numbers
    const validQuantity = parseFloat(quantity);
    const validPricePerKg = parseFloat(pricePerKg);
    const validPricePerQuantity = parseFloat(pricePerQuantity);

    if (pricePerKg && validQuantity > 0 && !isNaN(validPricePerKg)) {
      totalPrice = validPricePerKg * validQuantity;
    } else if (pricePerQuantity && validQuantity > 0 && !isNaN(validPricePerQuantity)) {
      totalPrice = validPricePerQuantity * validQuantity;
    } else {
      alert("Invalid quantity or price!");
      return;
    }

    const newItem = {
      product: productName,
      pricePerKg: pricePerKg || "N/A",
      pricePerQuantity: pricePerQuantity || "N/A",
      quantity: validQuantity,
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

    // Calculate total amount
    const newTotalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, totalPrice);
    setTotalAmount(newTotalAmount);

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
    doc.text("Billing Receipt", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Customer: ${bill.username}`, 20, 40);
    doc.text(`Phone: ${bill.phoneNumber}`, 20, 50);
    doc.text(`Date: ${bill.date}`, 20, 60);

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

    doc.autoTable(tableColumn, tableRows, { startY: 70 });
    doc.text(`Total Amount: ₹${bill.totalAmount.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);

    doc.save(`${bill.username}_bill_${Date.now()}.pdf`);
  };

  const handleEditItem = (index) => {
    const item = cartItems[index];
    setProductName(item.product);
    setQuantity(item.quantity);
    setPricePerKg(item.pricePerKg);
    setPricePerQuantity(item.pricePerQuantity);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== index);
    setCartItems(updatedCart);

    // Recalculate total amount
    const newTotalAmount = updatedCart.reduce((acc, item) => acc + item.totalPrice, 0);
    setTotalAmount(newTotalAmount);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white p-6 flex flex-col items-center justify-between" style={{ height: '100vh' }}>
      <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-6">Store Billing System</h1>

      {!showBillForm && (
        <div className="w-full max-w-4xl p-8 space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Customer Name</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              className="w-full p-2 text-sm rounded-md border-2 border-pink-500 focus:ring-2 focus:ring-pink-400 text-black"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 text-sm rounded-md border-2 border-pink-500 focus:ring-2 focus:ring-pink-400 text-black"
              placeholder="Enter phone number"
              maxLength="10"
            />
          </div>
          <button
            onClick={startBilling}
            className="w-full py-4 bg-yellow-400 text-black rounded-md text-xl font-bold hover:bg-yellow-500 transition duration-300"
          >
            Start Billing
          </button>
        </div>
      )}

      {showBillForm && (
        <>
          <div className="w-full max-w-4xl p-8 space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-lg font-semibold mb-2">Product Name</label>
              <input
                type="text"
                name="productName"
                value={productName}
                onChange={handleInputChange}
                className="w-full p-2 text-sm rounded-md border-2 border-purple-500 focus:ring-2 focus:ring-purple-400 text-black"
                placeholder="Enter product name"
              />
            </div>

            {/* Price Type */}
            <div>
              <label className="block text-lg font-semibold mb-2">Price Type</label>
              <select
                name="priceType"
                value={priceType}
                onChange={handlePriceTypeChange}
                className="w-full p-2 text-sm rounded-md border-2 border-purple-500 focus:ring-2 focus:ring-purple-400 text-black"
              >
                <option value="quantity">Price per Quantity</option>
                <option value="kg">Price per Kg</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-lg font-semibold mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={handleInputChange}
                className="w-full p-2 text-sm rounded-md border-2 border-purple-500 focus:ring-2 focus:ring-purple-400 text-black"
                placeholder="Enter quantity"
                min="1"
              />
            </div>

            {/* Price per Kg or Quantity */}
            {priceType === "kg" ? (
              <div>
                <label className="block text-lg font-semibold mb-2">Price per Kg</label>
                <input
                  type="number"
                  name="pricePerKg"
                  value={pricePerKg}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm rounded-md border-2 border-purple-500 focus:ring-2 focus:ring-purple-400 text-black"
                  placeholder="Enter price per kg"
                  min="0"
                />
              </div>
            ) : (
              <div>
                <label className="block text-lg font-semibold mb-2">Price per Quantity</label>
                <input
                  type="number"
                  name="pricePerQuantity"
                  value={pricePerQuantity}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm rounded-md border-2 border-purple-500 focus:ring-2 focus:ring-purple-400 text-black"
                  placeholder="Enter price per quantity"
                  min="0"
                />
              </div>
            )}

            <button
              onClick={addToCart}
              className="w-full py-4 bg-yellow-400 text-black rounded-md text-xl font-bold hover:bg-yellow-500 transition duration-300"
            >
              Add to Cart
            </button>
          </div>

          {/* Cart Table */}
          <div className="w-full max-w-4xl bg-gradient-to-r from-green-500 to-blue-600 p-8 rounded-lg shadow-xl space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-300">Cart</h2>
            <table className="w-full table-auto text-black">
              <thead>
                <tr className="bg-purple-200">
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Price per Quantity</th>
                  <th className="py-2 px-4 text-left">Price per Kg</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Total Price</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{item.product}</td>
                    <td className="py-2 px-4">{item.pricePerQuantity}</td>
                    <td className="py-2 px-4">{item.pricePerKg}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">{item.totalPrice.toFixed(2)}</td>
                    <td className="py-2 px-4 flex justify-between">
                      <FaEdit
                        onClick={() => handleEditItem(index)}
                        className="cursor-pointer text-blue-600 text-3xl"
                      />
                      <FaTrashAlt
                        onClick={() => handleDeleteItem(index)}
                        className="cursor-pointer text-red-600 text-3xl"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-between">
              <div className="font-semibold text-lg text-yellow-300">
                Total Amount: ₹{totalAmount.toFixed(2)}
              </div>
              <button
                onClick={saveBill}
                className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800 text-xl"
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
