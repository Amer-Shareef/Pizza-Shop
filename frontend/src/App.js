import React from "react";  // React library for building components
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";  // Importing Router and routing components
import ItemManagement from "./components/ItemManagement";  // Importing ItemManagement component
import InvoiceManagement from "./components/InvoiceManagement";  // Importing InvoiceManagement component

// Main App component
const App = () => {
  return (
    // Using Tailwind CSS for styling the entire app background and text color
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Router: Enables navigation within the app */}
      <Router>
        {/* Header Section */}
        <header className="p-4 bg-gray-800 shadow-md">
          {/* Navigation Menu */}
          <nav className="flex justify-center space-x-4">
            {/* Link to the Item Management page */}
            <Link to="/" className="text-xl font-semibold hover:underline">
              Item Management
            </Link>
            {/* Link to the Invoice Management page */}
            <Link to="/invoices" className="text-xl font-semibold hover:underline">
              Invoice Management
            </Link>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Routing configuration */}
          <Routes>
            {/* Route to show ItemManagement component on the homepage */}
            <Route path="/" element={<ItemManagement />} />
            {/* Route to show InvoiceManagement component on the '/invoices' page */}
            <Route path="/invoices" element={<InvoiceManagement />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
