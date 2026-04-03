// =============================
// FRESH BAKES - BACKEND SERVER
// =============================

// =============================
// API 1: GET PRODUCTS
// =============================
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// =============================
// API 2: ADD CUSTOMER
// =============================
app.post("/customer", (req, res) => {
  const { name, email, phone, address } = req.body;

  const sql = `
    INSERT INTO customers (name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, address], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("✅ Customer Saved");
    }
  });
});

// =============================
// API 3: PLACE ORDER
// =============================
app.post("/order", (req, res) => {
  const { customer_id, total, items } = req.body;

  const order_id = "FB" + Date.now();

  // Insert into orders table
  const orderSQL = `
    INSERT INTO orders (order_id, customer_id, total)
    VALUES (?, ?, ?)
  `;

  db.query(orderSQL, [order_id, customer_id, total], (err, result) => {
    if (err) {
      res.send(err);
      return;
    }

    // Insert items
    items.forEach(item => {
      const itemSQL = `
        INSERT INTO order_items (order_id, product_id, quantity)
        VALUES (?, ?, ?)
      `;

      db.query(itemSQL, [order_id, item.id, item.qty]);
    });

    res.json({
      message: "✅ Order Placed Successfully",
      order_id: order_id
    });
  });
});

// =============================
// API 4: GET ORDERS
// =============================
app.get("/orders", (req, res) => {
  const sql = "SELECT * FROM orders";

  db.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// =============================
// SERVER START
// =============================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
}); 