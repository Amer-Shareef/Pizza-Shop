package main

import (
    "database/sql"                      // Provides access to the database
    "log"                               // Used for logging errors and information
    _ "github.com/go-sql-driver/mysql"  // Import MySQL driver
)

var db *sql.DB // Global variable for database connection

// connectDB establishes a connection to the MySQL database and tests the connection.
// If successful, it logs a success message, otherwise it logs an error and terminates the program.
func connectDB() {
    var err error
    // Open a connection to the MySQL database using credentials and the database name
    db, err = sql.Open("mysql", "root:12345678@tcp(127.0.0.1:3306)/pizza_shop")
    if err != nil {
        // If there's an error opening the connection, log the error and terminate
        log.Fatal("Error connecting to database: ", err)
    }

    // Test the connection to the database by pinging it
    err = db.Ping()
    if err != nil {
        // If there's an error pinging the database, log the error and terminate
        log.Fatal("Database is unreachable: ", err)
    }

    // Log a success message when the connection is successfully established
    log.Println("Connected to MySQL database successfully!")
}
