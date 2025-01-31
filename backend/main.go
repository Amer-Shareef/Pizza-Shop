package main

import (
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {
    // Connect to the database when the server starts
    connectDB()

    // Initialize Gin router
    router := gin.Default()
    // Enable CORS to allow requests from different domains
    router.Use(cors.Default())

    // Define Item CRUD operations
    router.GET("/api/items", getAllItems)        // Get all items
    router.POST("/api/items", createItem)        // Add a new item
    router.PUT("/api/items/:id", updateItem)    // Update an existing item
    router.DELETE("/api/items/:id", deleteItem) // Delete an item

    // Define Invoice operations
    router.GET("/api/invoices", getAllInvoices)   // Get all invoices
    router.POST("/api/invoices", createInvoice)   // Create a new invoice

    // Start the web server on port 8080
    router.Run(":8080")
}

// GET /api/items
// This function retrieves all items from the database and sends them in the response
func getAllItems(c *gin.Context) {
    rows, err := db.Query("SELECT item_id, name, price, type FROM items")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var items []Item
    for rows.Next() {
        var item Item
        // Scan each row into the Item struct
        if err := rows.Scan(&item.ID, &item.Name, &item.Price, &item.Type); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        items = append(items, item)
    }
    // Return the list of items as a JSON response
    c.JSON(http.StatusOK, items)
}

// POST /api/items
// This function adds a new item to the database
func createItem(c *gin.Context) {
    var newItem Item

    // Bind the incoming JSON to the newItem struct
    if err := c.ShouldBindJSON(&newItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
        return
    }

    // Insert the item into the database
    query := "INSERT INTO items (name, price, type) VALUES (?, ?, ?)"
    result, err := db.Exec(query, newItem.Name, newItem.Price, newItem.Type)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Retrieve the last inserted ID and set it in the newItem struct
    lastID, _ := result.LastInsertId()
    newItem.ID = int(lastID)
    // Return the newly created item as a response
    c.JSON(http.StatusOK, newItem)
}

// PUT /api/items/:id
// This function updates an existing item in the database
func updateItem(c *gin.Context) {
    id := c.Param("id")
    var updatedItem Item

    // Bind the incoming JSON to the updatedItem struct
    if err := c.ShouldBindJSON(&updatedItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON", "details": err.Error()})
        return
    }

    // Update the item in the database
    query := "UPDATE items SET name=?, price=?, type=? WHERE id=?"
    _, err := db.Exec(query, updatedItem.Name, updatedItem.Price, updatedItem.Type, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Return a success message
    c.JSON(http.StatusOK, gin.H{"message": "Item updated successfully"})
}

// DELETE /api/items/:id
// This function deletes an item from the database
func deleteItem(c *gin.Context) {
    id := c.Param("id")

    // Delete the item from the database
    query := "DELETE FROM items WHERE item_id=?"
    _, err := db.Exec(query, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Return a success message
    c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}

// GET /api/invoices
// This function retrieves all invoices and their associated items
func getAllInvoices(c *gin.Context) {
    rows, err := db.Query("SELECT invoice_id, customer_name, total_amount, date FROM invoices")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var invoices []Invoice
    for rows.Next() {
        var invoice Invoice
        // Scan each row into the Invoice struct
        if err := rows.Scan(&invoice.ID, &invoice.CustomerName, &invoice.TotalAmount, &invoice.Date); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // Fetch items linked to the invoice
        itemRows, err := db.Query(`
            SELECT ii.item_id, ii.quantity, i.name, i.price 
            FROM invoice_items ii
            JOIN items i ON ii.item_id = i.item_id
            WHERE ii.invoice_id = ?`, invoice.ID)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer itemRows.Close()

        var items []InvoiceItem
        for itemRows.Next() {
            var item InvoiceItem
            if err := itemRows.Scan(&item.ItemID, &item.Quantity, &item.ItemName, &item.Price); err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            items = append(items, item)
        }
        invoice.Items = items
        invoices = append(invoices, invoice)
    }

    // Return the list of invoices as a JSON response
    c.JSON(http.StatusOK, invoices)
}

// POST /api/invoices
// This function creates a new invoice and inserts its items into the database
func createInvoice(c *gin.Context) {
    var newInvoice Invoice
    // Bind the incoming JSON to the newInvoice struct
    if err := c.ShouldBindJSON(&newInvoice); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Insert the invoice into the invoices table
    result, err := db.Exec("INSERT INTO invoices (customer_name, total_amount) VALUES (?, ?)",
        newInvoice.CustomerName, newInvoice.TotalAmount)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Get the ID of the newly created invoice
    invoiceID, _ := result.LastInsertId()

    // Insert the invoice items into the invoice_items table
    for _, item := range newInvoice.Items {
        _, err := db.Exec("INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES (?, ?, ?)",
            invoiceID, item.ItemID, item.Quantity)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }

    // Return a success message with the new invoice ID
    c.JSON(http.StatusCreated, gin.H{"message": "Invoice created successfully", "invoice_id": invoiceID})
}
