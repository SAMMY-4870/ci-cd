const express = require("express");
const cors = require("cors");
const path = require("path");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("./firebase");

const app = express();

// ======================================
// CONFIG
// ======================================

const PORT = process.env.PORT || 5000;

const SECRET = "cloudship_secret";

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {

  console.log(`📡 ${req.method} ${req.url}`);

  next();
});

// ======================================
// FRONTEND STATIC FILES
// ======================================

app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

// ======================================
// HOME PAGE
// ======================================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../frontend/index.html"
    )
  );
});

// ======================================
// HEALTH CHECK
// ======================================

app.get("/health", (req, res) => {

  res.json({

    success: true,

    status: "OK"
  });
});

// ======================================
// OTP STORE
// ======================================

let otpStore = {};

// ======================================
// SEND OTP
// ======================================

app.post("/send-otp", (req, res) => {

  try {

    const { mobile } = req.body;

    if (!mobile) {

      return res.status(400).json({

        success: false,

        error: "Mobile required ❌"
      });
    }

    const otp =
      Math.floor(
        1000 + Math.random() * 9000
      );

    otpStore[mobile] = otp;

    console.log(
      `📲 OTP for ${mobile}: ${otp}`
    );

    res.json({

      success: true,

      message: "OTP sent ✅",

      otp
    });

  } catch (err) {

    console.error(
      "OTP ERROR:",
      err
    );

    res.status(500).json({

      success: false,

      error:
        "OTP failed ❌"
    });
  }
});

// ======================================
// REGISTER
// ======================================

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

        success: false,

        error:
          "All fields required ❌"
      });
    }

    if (otpStore[mobile] != otp) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid OTP ❌"
      });
    }

    const existing =
      await db.collection("users")
      .where("mobile", "==", mobile)
      .get();

    if (!existing.empty) {

      return res.status(400).json({

        success: false,

        error:
          "User already exists ❌"
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

      message:
        "Registration successful ✅"
    });

  } catch (err) {

    console.error(
      "REGISTER ERROR:",
      err
    );

    res.status(500).json({

      success: false,

      error:
        "Registration failed ❌"
    });
  }
});

// ======================================
// LOGIN
// ======================================

app.post("/login", async (req, res) => {

  try {

    const { mobile, password } = req.body;

    if (!mobile || !password) {

      return res.status(400).json({

        success: false,

        error:
          "Mobile and password required ❌"
      });
    }

    const snapshot =
      await db.collection("users")
      .where("mobile", "==", mobile)
      .get();

    if (snapshot.empty) {

      return res.status(400).json({

        success: false,

        error:
          "User not found ❌"
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

        success: false,

        error:
          "Wrong password ❌"
      });
    }

    const token =
      jwt.sign(

        {
          mobile: user.mobile,
          role: user.role
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

      success: false,

      error:
        "Login failed ❌"
    });
  }
});

// ======================================
// AUTH MIDDLEWARE
// ======================================

function auth(req, res, next) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({

        success: false,

        error:
          "No token ❌"
      });
    }

    if (
      !authHeader.startsWith("Bearer ")
    ) {

      return res.status(401).json({

        success: false,

        error:
          "Invalid token format ❌"
      });
    }

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const decoded =
      jwt.verify(
        token,
        SECRET
      );

    req.user = decoded;

    next();

  } catch (err) {

    console.error(
      "AUTH ERROR:",
      err
    );

    res.status(401).json({

      success: false,

      error:
        "Invalid token ❌"
    });
  }
}

// ======================================
// CREATE ORDER
// ======================================

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

        success: false,

        error:
          "Complete details required ❌"
      });
    }

    const qty =
      Number(quantity || 1);

    const medicinePrice =
      Number(price || 0);

    const tax =
      medicinePrice * 0.18;

    const deliveryCharge = 40;

    const total =

      medicinePrice * qty +

      tax +

      deliveryCharge;

    const doc =
      await db.collection("orders")
      .add({

        name,
        mobile,
        address,
        medicine,

        quantity: qty,

        price: medicinePrice,

        tax,

        deliveryCharge,

        total,

        status: "Pending",

        createdAt: new Date()
      });

    res.json({

      success: true,

      message:
        "Order placed ✅",

      orderId: doc.id
    });

  } catch (err) {

    console.error(
      "ORDER ERROR:",
      err
    );

    res.status(500).json({

      success: false,

      error:
        "Order failed ❌"
    });
  }
});

// ======================================
// GET ORDERS
// ======================================

app.get("/orders", async (req, res) => {

  try {

    const snapshot =
      await db.collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders =
      snapshot.docs.map(doc => {

        const data =
          doc.data();

        return {

          id: doc.id,

          ...data,

          createdAt:
            data.createdAt
            ?.toDate()
            ?.toLocaleString()
        };
      });

    res.json({

      success: true,

      total: orders.length,

      data: orders
    });

  } catch (err) {

    console.error(
      "GET ERROR:",
      err
    );

    res.status(500).json({

      success: false,

      error:
        "Fetch failed ❌"
    });
  }
});

// ======================================
// UPDATE ORDER STATUS
// ======================================

app.put(
  "/order/:id",
  auth,
  async (req, res) => {

    try {

      const { status } =
        req.body;

      await db.collection("orders")
        .doc(req.params.id)
        .update({

          status
        });

      res.json({

        success: true,

        message:
          "Status updated ✅"
      });

    } catch (err) {

      console.error(
        "UPDATE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        error:
          "Update failed ❌"
      });
    }
  }
);

// ======================================
// TRACKING
// ======================================

app.put(
  "/tracking/:id",
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const allowed = [

        "Pending",

        "Packed",

        "Out For Delivery",

        "Delivered"
      ];

      if (
        !allowed.includes(status)
      ) {

        return res.status(400).json({

          success: false,

          error:
            "Invalid status ❌"
        });
      }

      await db.collection("orders")
        .doc(req.params.id)
        .update({

          status
        });

      res.json({

        success: true,

        message:
          "Tracking updated 🚚"
      });

    } catch (err) {

      console.error(
        "TRACKING ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        error:
          "Tracking failed ❌"
      });
    }
  }
);

// ======================================
// GLOBAL ERROR
// ======================================

app.use((err, req, res, next) => {

  console.error(
    "GLOBAL ERROR:",
    err
  );

  res.status(500).json({

    success: false,

    error:
      "Internal server error ❌"
  });
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, "0.0.0.0", () => {

  console.log(`

========================================
🚀 CLOUDSHIP SERVER STARTED
🌍 Running on Port: ${PORT}
========================================

  `);
});