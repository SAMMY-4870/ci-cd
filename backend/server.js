const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const PDFDocument = require("pdfkit");
const invoiceRoutes =
  require("./routes/invoice");

const app = express();

// ================= CONFIG =================

const PORT =
  process.env.PORT || 8080;

const SECRET =
  "cloudship_secret";


// ================= SERVER START =================

app.listen(PORT, "0.0.0.0", () => {

  console.log(`
========================================
🚀 CLOUDSHIP SERVER STARTED
🌍 Running on Port: ${PORT}
========================================
  `);
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use("/invoice", invoiceRoutes);

// ================= LOGGER =================
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ================= HOME =================
app.get("/", (req, res) => {
  res.send("🚀 CloudShip Advanced API Running");
});

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK"
  });
});

// ================= OTP STORE =================
let otpStore = {};

// ================= SEND OTP =================
app.post("/send-otp", (req, res) => {

  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({
      error: "Mobile required ❌"
    });
  }

  const otp =
    Math.floor(1000 + Math.random() * 9000);

  otpStore[mobile] = otp;

  console.log(`OTP for ${mobile}: ${otp}`);

  res.json({
    success: true,
    message: "OTP sent ✅",
    otp
  });
});

// ================= VERIFY OTP =================
app.post("/verify-otp", async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      mobile,
      otp,
      password
    } = req.body;

    if (
      !firstName ||
      !mobile ||
      !otp ||
      !password
    ) {
      return res.status(400).json({
        error: "All fields required ❌"
      });
    }

    if (otpStore[mobile] != otp) {
      return res.status(400).json({
        error: "Invalid OTP ❌"
      });
    }

    const existing = await db
      .collection("users")
      .where("mobile", "==", mobile)
      .get();

    if (!existing.empty) {
      return res.status(400).json({
        error: "User already exists ❌"
      });
    }

    const hash =
      await bcrypt.hash(password, 10);

    await db.collection("users").add({

      firstName,
      lastName,
      mobile,

      password: hash,

      role: "user",

      createdAt: new Date()
    });

    delete otpStore[mobile];

    res.json({
      success: true,
      message: "User registered successfully ✅"
    });

  } catch (err) {

    console.error("REGISTER ERROR:", err);

    res.status(500).json({
      error: "Register failed ❌"
    });
  }
});

// ================= LOGIN =================

app.post("/login", async (req, res) => {

  try {

    const { mobile, password } = req.body;

    if (!mobile || !password) {

      return res.status(400).json({
        error: "Mobile and password required ❌"
      });
    }

    const snapshot = await db
      .collection("users")
      .where("mobile", "==", mobile)
      .get();

    if (snapshot.empty) {

      return res.status(400).json({
        error: "User not found ❌"
      });
    }

    const user =
      snapshot.docs[0].data();

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {

      return res.status(400).json({
        error: "Wrong password ❌"
      });
    }

    const SECRET =
      "cloudship_secret";

    const token =
      jwt.sign(

        {
          mobile: user.mobile,
          role: user.role || "user"
        },

        SECRET,

        {
          expiresIn: "2h"
        }
      );

    res.json({

      success: true,

      message:
        "Login successful ✅",

      token
    });

  } catch (err) {

    console.error(
      "LOGIN ERROR:",
      err
    );

    res.status(500).json({

      error:
        "Login failed ❌"
    });
  }
});

// ================= AUTH =================

function auth(req, res, next) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        error: "No token ❌"
      });
    }

    // CHECK BEARER

    if (
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({
        error:
          "Invalid token format ❌"
      });
    }

    // EXTRACT TOKEN

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const SECRET =
      "cloudship_secret";

    const decoded =
      jwt.verify(
        token,
        SECRET
      );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(
      "AUTH ERROR:",
      err.message
    );

    return res.status(401).json({
      error: "Invalid token ❌"
    });
  }
}
// ================= CREATE ORDER =================
app.post("/order", auth, async (req, res) => {

  try {

    const {

      name,
      mobile,
      address,
      medicine,

      quantity,
      price

    } = req.body;

    if (
      !name ||
      !mobile ||
      !address ||
      !medicine
    ) {
      return res.status(400).json({
        error: "Complete details required ❌"
      });
    }

    const tax = price * 0.18;

    const deliveryCharge = 40;

    const total =
      (price * quantity)
      + tax
      + deliveryCharge;

    const doc =
      await db.collection("orders").add({

        name,
        mobile,
        address,
        medicine,

        quantity,
        price,

        tax,
        deliveryCharge,
        total,

        status: "Pending",

        createdAt: new Date()
      });

    res.json({
      success: true,
      message: "Order placed ✅",
      id: doc.id
    });

  } catch (err) {

    console.error("ORDER ERROR:", err);

    res.status(500).json({
      error: "Order failed ❌"
    });
  }
});

// ================= GET ORDERS =================
app.get("/orders", async (req, res) => {

  try {

    const snapshot =
      await db.collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map(doc => {

      const data = doc.data();

      return {

        id: doc.id,

        name: data.name,
        mobile: data.mobile,
        address: data.address,
        medicine: data.medicine,

        quantity: data.quantity,
        price: data.price,

        tax: data.tax,
        deliveryCharge: data.deliveryCharge,
        total: data.total,

        status: data.status,

        createdAt:
          data.createdAt
          .toDate()
          .toLocaleString()
      };
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (err) {

    console.error("GET ERROR:", err);

    res.status(500).json({
      error: "Fetch failed ❌"
    });
  }
});

// ================= UPDATE STATUS =================
app.put("/order/:id", auth, async (req, res) => {

  try {

    const { status } = req.body;

    await db.collection("orders")
      .doc(req.params.id)
      .update({ status });

    res.json({
      success: true,
      message: "Status updated 🔄"
    });

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      error: "Update failed ❌"
    });
  }
});

// ================= TRACKING =================
app.put("/tracking/:id", async (req, res) => {

  const { status } = req.body;

  const allowed = [

    "Pending",

    "Packed",

    "Out For Delivery",

    "Delivered"
  ];

  if (!allowed.includes(status)) {

    return res.status(400).json({
      error: "Invalid status ❌"
    });
  }

  await db.collection("orders")
    .doc(req.params.id)
    .update({ status });

  res.json({
    success: true,
    message: "Tracking updated 🚚"
  });
});











// ================= GLOBAL ERROR =================
app.use((err, req, res, next) => {

  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    error: "Something went wrong ❌"
  });
});

// ================= START =================
// ================= START =================

app.listen(PORT, "0.0.0.0", () => {

  console.log(`
========================================
🚀 CLOUDSHIP SERVER STARTED
🌍 Running on Port: ${PORT}
========================================
  `);
});