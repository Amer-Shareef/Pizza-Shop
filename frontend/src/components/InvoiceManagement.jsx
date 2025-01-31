import React, { useState, useEffect } from "react"; 
import axios from "axios"; // Importing axios for making HTTP requests

// InvoiceManagement component
const InvoiceManagement = () => {
  // State to store the list of invoices fetched from the server
  const [invoices, setInvoices] = useState([]);
  
  // State to manage customer name input
  const [customerName, setCustomerName] = useState("");

  // useEffect hook to fetch invoices when the component mounts (initial load)
  useEffect(() => {
    fetchInvoices(); // Call the fetchInvoices function to get the list of invoices
  }, []); // Empty dependency, this runs only once when the component is mounted

  // Function to fetch invoices from the backend using axios
  const fetchInvoices = async () => {
    try {
      // Send GET request to fetch invoices
      const response = await axios.get("http://localhost:8080/api/invoices");
      setInvoices(response.data); // Update the state with fetched invoices
    } catch (error) {
      console.error("Error fetching invoices:", error); // Log error if something goes wrong
    }
  };

  // Function to create a new invoice
  const handleCreateInvoice = async () => {
    // Check if customerName is empty
    if (!customerName.trim()) {
      alert("Please enter a customer name."); // Alert if customer name is not provided
      return;
    }

    try {
      // Send POST request to create a new invoice
      const response = await axios.post("http://localhost:8080/api/invoices", {
        customer_name: customerName.trim(), // Send the customer name as part of the request
      });
      setCustomerName(""); // Clear the customer name input field after creating the invoice
      fetchInvoices(); // Refresh the invoice list after creation
      console.log("Invoice created:", response.data); // Log the created invoice data
    } catch (error) {
      console.error("Error creating invoice:", error.response?.data || error.message); // Log any error during the POST request
    }
  };

  // Function to simulate printing an invoice
  const handlePrintInvoice = (invoice) => {
    console.log("Printing invoice:", invoice); 
    alert(`Invoice for ${invoice.customer_name} will be printed.`); // print action with an alert
  };

  return (
    <div className="container mx-auto">
      {/* Header for the Invoice Management page */}
      <h1 className="text-3xl font-bold mb-6">Invoice Management</h1>

      {/* Form to add a new customer name */}
      <div className="flex space-x-4 mb-6">
        {/* Input field for customer name */}
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)} // Update the state with the entered name
          className="px-4 py-2 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 w-1/2"
        />
        
        {/* Button to create an invoice */}
        <button
          onClick={handleCreateInvoice} // Call handleCreateInvoice when clicked
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Create Invoice
        </button>
      </div>

      {/* Section to display the list of invoices */}
      <div>
        {/* Subheader for the invoices list */}
        <h2 className="text-2xl font-bold mb-4">Invoices</h2>

        {/* Table to display the invoices */}
        <table className="table-auto w-full bg-gray-800 text-white rounded">
          {/* Table header with column names */}
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Date & Time</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          
          {/* Table body that maps over the invoices array */}
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-700">
                {/* Display customer name */}
                <td className="px-4 py-2">{invoice.customer_name}</td>
                {/* Display total amount formatted to 2 decimal places */}
                <td className="px-4 py-2">${invoice.total_amount.toFixed(2)}</td>
                {/* Format and display the invoice creation date */}
                <td className="px-4 py-2">{new Date(invoice.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {/* Button to print the invoice */}
                  <button
                    onClick={() => handlePrintInvoice(invoice)} // Trigger handlePrintInvoice on click
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceManagement; // Export the component for use in other parts of the application
