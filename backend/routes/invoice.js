const express = require("express");
const PDFDocument = require("pdfkit");
const db = require("../firebase");

const router = express.Router();

// ================= PREMIUM INVOICE =================

router.get("/:id", async (req, res) => {

  try {

    const docData = await db
      .collection("orders")
      .doc(req.params.id)
      .get();

    if (!docData.exists) {

      return res
        .status(404)
        .send("Invoice not found ❌");
    }

    const order = docData.data();

    const pdf = new PDFDocument({
      margin: 40,
      size: "A4"
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    pdf.pipe(res);

    // ================= SERIAL =================

    const serialNumber =
      "SR" +
      req.params.id
        .substring(0, 6)
        .toUpperCase();

    // ================= CALCULATIONS =================

    const subtotal =
      Number(order.price) *
      Number(order.quantity);

    const tax =
      Number(order.tax);

    const delivery =
      Number(order.deliveryCharge);

    const grandTotal =
      Number(order.total);

    // ================= HEADER =================

    pdf
      .rect(0, 0, 700, 120)
      .fill("#0f172a");

    pdf
      .fillColor("white")
      .fontSize(28)
      .text(
        "CloudShip Invoice",
        50,
        40
      );

    pdf
      .fontSize(12)
      .text(
        "Smart Medical Delivery Platform",
        50,
        78
      );

    // ================= CUSTOMER =================

    pdf
      .fillColor("black")
      .fontSize(18)
      .text(
        "Customer Details",
        50,
        150
      );

    pdf
      .fontSize(13)
      .text(
        `Name: ${order.name}`,
        50,
        190
      );

    pdf.text(
      `Mobile: ${order.mobile}`,
      50,
      215
    );

    pdf.text(
      `Address: ${order.address}`,
      50,
      240
    );

    // ================= INVOICE INFO =================

    pdf
      .fontSize(24)
      .text(
        "INVOICE",
        380,
        150
      );

    pdf
      .fontSize(12)
      .text(
        "Invoice ID:",
        380,
        195
      );

    pdf.text(
      serialNumber,
      470,
      195
    );

    pdf.text(
      "Date:",
      380,
      220
    );

    pdf.text(
      new Date().toLocaleString(),
      470,
      220
    );

    pdf.text(
      "Status:",
      380,
      245
    );

    pdf.text(
      order.status,
      470,
      245
    );

    // ================= TABLE =================

    const tableTop = 330;

    pdf
      .rect(50, tableTop, 500, 30)
      .fill("#2563eb");

    pdf
      .fillColor("white")
      .fontSize(12)

      .text(
        "Medicine",
        65,
        tableTop + 8
      )

      .text(
        "Qty",
        250,
        tableTop + 8
      )

      .text(
        "Price",
        320,
        tableTop + 8
      )

      .text(
        "Tax",
        400,
        tableTop + 8
      )

      .text(
        "Total",
        480,
        tableTop + 8
      );

    // ================= TABLE BODY =================

    pdf
      .rect(50, tableTop + 30, 500, 40)
      .stroke();

    pdf
      .fillColor("black")
      .fontSize(12)

      .text(
        order.medicine,
        65,
        tableTop + 45
      )

      .text(
        String(order.quantity),
        255,
        tableTop + 45
      )

      .text(
        `₹${Number(order.price)}`,
        320,
        tableTop + 45
      )

      .text(
        `₹${tax}`,
        400,
        tableTop + 45
      )

      .text(
        `₹${grandTotal}`,
        480,
        tableTop + 45
      );

    // ================= TOTAL BOX =================

    pdf
      .roundedRect(
        340,
        450,
        210,
        120,
        10
      )
      .fillAndStroke(
        "#f1f5f9",
        "#cbd5e1"
      );

    pdf
      .fillColor("black")
      .fontSize(13)

      .text(
        `Subtotal: ₹${subtotal}`,
        360,
        475
      )

      .text(
        `Tax: ₹${tax}`,
        360,
        505
      )

      .text(
        `Delivery: ₹${delivery}`,
        360,
        535
      );

    pdf
      .fillColor("#16a34a")
      .fontSize(18)
      .text(
        `Grand Total: ₹${grandTotal}`,
        360,
        575
      );

    // ================= FOOTER =================

    pdf
      .fillColor("#64748b")
      .fontSize(11)
      .text(
        "Thank you for choosing CloudShip 💙",
        0,
        760,
        {
          align: "center"
        }
      );

    pdf.end();

  } catch (err) {

    console.error(err);

    res
      .status(500)
      .send("Invoice failed ❌");
  }
});

module.exports = router;