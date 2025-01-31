import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css'; // Importing styles

const ItemManagement = () => {
  const [items, setItems] = useState([]); // Store the list of items
  const [customerName, setCustomerName] = useState(""); // Store the customer name for billing
  const [newItem, setNewItem] = useState({ name: '', price: '', type: '' }); // Store the new item details before adding it to the list

  // useEffect hook to fetch the list of items when the component loads
  useEffect(() => {
    fetchItems(); // Calling fetchItems function to populate the items list
  }, []); // Empty array, runs only once, when the component first loads

  // Function to fetch items from the backend API
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/items');
      setItems(response.data); // Update the items state with the fetched data
    } catch (error) {
      console.error('Error fetching items:', error);  // Log error if the API request fails
    }
  };

  // Calculate the total amount by adding the prices of all items
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  // Adding a new item
  const handleAddItem = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Trimming unnecessary whitespace when adding new item
    const formattedItem = {
      name: newItem.name.trim(),
      price: parseFloat(newItem.price), // Convert price to a number
      type: newItem.type.trim(),
    };

    try {
      // Send a POST request to add the item to the backend
      await axios.post('http://localhost:8080/api/items', formattedItem, { 
        headers: { 'Content-Type': 'application/json' },  // Set the correct header for JSON data
      });
      // Clear the input fields after successfully adding the item
      setNewItem({ name: '', price: '', type: '' });
      fetchItems(); // Refresh the item list after adding a new item
    } catch (error) {
      console.error('Error adding item:', error.response ? error.response.data : error.message);  // Log any error
    }
  };

  // Deleting an item
  const handleDeleteItem = async (id) => {
    try {
      // Send a DELETE request to remove the item from the backend
      await axios.delete(`http://localhost:8080/api/items/${id}`);
      fetchItems(); // Refresh the item list after deleting an item
    } catch (error) {
      console.error('Error deleting item:', error.response ? error.response.data : error.message);  // Log any error
    }
  };

  // Creating an invoice when billing the customer
  const handleBillCustomer = async () => {
    const totalAmount = calculateTotal(); // Calculate the total amount for the invoice
  
    const invoiceData = {
      customer_name: customerName,
      total_amount: totalAmount,
      items: items.map((item) => ({
        item_id: item.id,
        quantity: 1, // Default set to 1 quantity, can adjust as needed
      })),
    };
  
    try {
      // POST request to create a new invoice
      const response = await axios.post("http://localhost:8080/api/invoices", invoiceData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Invoice created successfully!"); // Alert upon success
    } catch (error) {
      console.error("Error creating invoice:", error.response?.data || error.message);
      alert("Failed to create invoice. Please try again."); // Alert upon failure
    }
  };  

  // Calculate total amount every time the items list changes
  const totalAmount = calculateTotal();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Item Management</h1>
      <form className="space-y-4 mb-6" onSubmit={handleAddItem}>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Item Name"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type (e.g., pizza)"
            className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Item
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-white mb-2">Customer Name</h2>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Current Items</h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-gray-700 p-4 rounded"
            >
              {/* Display item details including name, price, and type */}
              <span className="text-white">
                {item.name} - ${item.price.toFixed(2)} ({item.type})
              </span>
              {/* Button to delete the item */}
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {/* Display total price and button to bill the customer */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-xl font-bold text-white">Total: ${totalAmount.toFixed(2)}</span>
          {/* Button to generate the invoice for the customer */}
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700"
            onClick={handleBillCustomer}  // Trigger invoice creation
          >
            Bill Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;
