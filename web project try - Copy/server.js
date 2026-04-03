// ==============================
// FRESH BAKES - FINAL BACKEND
// ==============================

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

// ==============================
// DATABASE CONNECTION
// ==============================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fresh_bakes",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database Error:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

// ==============================
// TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("Server Working ✅");
});

// ==============================
// ADD CUSTOMER
// ==============================
app.post("/customer", (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;

  console.log("DATA RECEIVED:", req.body);

  if (!firstName || !email || !phone || !address) {
    return res.status(400).send("Missing fields");
  }

  const sql = `
    INSERT INTO customers (firstname, lastname, email, phone, address)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [firstName, lastName, email, phone, address], (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).send("Database error");
    }

    res.send("Customer saved ✅");
  });
});

// ==============================
// PLACE ORDER
// ==============================
app.post("/order", (req, res) => {
  const { customer_id, total, items } = req.body;

  const order_id = "FB" + Date.now();

  const orderSQL = `
    INSERT INTO orders (order_id, customer_id, total)
    VALUES (?, ?, ?)
  `;

  db.query(orderSQL, [order_id, customer_id, total], (err, result) => {
    if (err) {
      console.log("ORDER ERROR:", err);
      return res.status(500).send("Order failed");
    }

    // Insert items
    items.forEach((item) => {
      const itemSQL = `
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (?, ?, ?)
      `;

      db.query(itemSQL, [order_id, item.id, item.qty]);
    });

    res.json({
      message: "Order placed successfully ✅",
      order_id: order_id
    });
  });
});

// ==============================
// GET ORDERS
// ==============================
app.get("/orders", (req, res) => {
  db.query("SELECT * FROM orders", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// Get Contacts

app.post("/contact", (req, res) => {

  const { first_name, last_name, email, phone, subject, message } = req.body;

  const sql = `
    INSERT INTO contact (first_name, last_name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [first_name, last_name, email, phone, subject, message],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("Error ❌");
      } else {
        console.log("Data inserted ✅");
        res.send("Success ✅");
      }
    }
  );
});

// ==============================
// START SERVER
// ==============================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
app.use(express.json());