const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CloudShip API Running 🚀");
});

app.post("/order", (req, res) => {
  const order = req.body;
  res.json({ message: "Order received", order });
});

app.listen(3000, () => console.log("Server running"));