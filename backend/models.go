package main

// Item represents an individual item in the pizza shop with properties like ID, name, price, and type.
type Item struct {
    ID    int     `json:"id"`       // Unique identifier for the item
    Name  string  `json:"name"`     // Name of the item ('Pepperoni Pizza')
    Price float64 `json:"price"`    // Price of the item
    Type  string  `json:"type"`     // Type of item ('pizza', 'cake', etc.)
}

// InvoiceItem represents an item in an invoice with its associated quantity and price.
// This allows us to track which items are linked to a specific invoice.
type InvoiceItem struct {
    ItemID   int     `json:"item_id"`               // The ID of the item from the Item table
    Quantity int     `json:"quantity"`              // The quantity of the item in the invoice
    ItemName string  `json:"item_name,omitempty"`   // Name of the item (optional, omitted if empty)
    Price    float64 `json:"price,omitempty"`       // Price of the item (optional, omitted if empty)
}

// Invoice represents a complete invoice including the customer details, total amount, and the items in the invoice.
// Each invoice will have multiple items associated with it.
type Invoice struct {
    ID           int           `json:"id"`            // Unique identifier for the invoice
    CustomerName string        `json:"customer_name"` // Name of the customer
    TotalAmount  float64       `json:"total_amount"`  // Total cost of the invoice
    Items        []InvoiceItem `json:"items"`         // A slice of InvoiceItem representing the items in the invoice
}
