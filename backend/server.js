const express = require("express");
const app = express();

app.use(express.json());

// 🔥 IMPORTANT FIX
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Hello from CloudShip 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});