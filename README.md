# Pizza-Shop

## Overview

The Pizza Shop Application is a full-stack web application built using React for the frontend, Go for the backend, and MySQL for the database. This application manages inventory (items) and allows users to create invoices. The application provides an intuitive interface for adding, deleting, and managing items, as well as billing customers and managing invoices.

---

## Technologies Used

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Go
- **Database:** MySQL

---

## Features

1. **Item Management:**
   - View the list of items in the pizza shop.
   - Add new items (name, price, type).
   - Delete items from the list.

2. **Invoice Management:**
   - Create invoices with a customer name.
   - View a list of created invoices with the total amount and date.
   - Print invoices (simulated in the UI).

---

## Backend

### Setup and Run

1. **Run the Backend:**

   Start the backend server:

   ```
   go run .
   ```

2. **Database Setup:**

   Ensure you have MySQL running locally with the following setup:

   - Database: `pizza_shop`
   - Tables: `items`, `invoices`, `invoice_items`

---

## Frontend

### Setup and Run

1. **Install Dependencies:**

   To install all frontend dependencies, run:

   ```
   npm install
   ```

2. **Run the Frontend:**

   Start the React development server:

   ```
   npm start
   ```

---

## API Endpoints

### 1. **GET /api/items**
   - Fetch the list of items from the database.

### 2. **POST /api/items**
   - Add a new item to the database.

### 3. **PUT /api/items/:id**
   - Update an existing item by ID.

### 4. **DELETE /api/items/:id**
   - Delete an item by ID.

### 5. **GET /api/invoices**
   - Fetch the list of invoices.

### 6. **POST /api/invoices**
   - Create a new invoice with the customer name and associated items.
