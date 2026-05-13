// ======================================
// INVOICE ID
// ======================================

const invoiceId =

  "PRX-" +

  Math.floor(

    100000 +

    Math.random() * 900000

  );

document.getElementById(
  "invoiceId"
).innerText = invoiceId;

// ======================================
// DATE TIME
// ======================================

document.getElementById(
  "date"
).innerText =

  new Date()
  .toLocaleString();

// ======================================
// MEDICINES
// ======================================

const medicines = [

  {

    name:
      "Metformin",

    batch:
      "MED4521",

    exp:
      "08/27",

    qty: 10,

    mrp: 120,

    gst: 12
  },

  {

    name:
      "Paracetamol",

    batch:
      "PAR7854",

    exp:
      "02/28",

    qty: 5,

    mrp: 80,

    gst: 5
  },

  {

    name:
      "Crocin",

    batch:
      "CRO9632",

    exp:
      "11/27",

    qty: 3,

    mrp: 90,

    gst: 5
  }
];

// ======================================
// TABLE
// ======================================

const tableBody =

  document.getElementById(
    "tableBody"
  );

let gross = 0;

let totalGST = 0;

// ======================================
// LOOP
// ======================================

medicines.forEach(

  (item,index)=>{

    const itemTotal =

      item.qty *
      item.mrp;

    const gstAmount =

      itemTotal *
      item.gst / 100;

    gross += itemTotal;

    totalGST += gstAmount;

    tableBody.innerHTML += `

      <tr>

        <td>

          ${index + 1}

        </td>

        <td>

          ${item.name}

        </td>

        <td>

          ${item.batch}

        </td>

        <td>

          ${item.exp}

        </td>

        <td>

          ${item.qty}

        </td>

        <td>

          ₹${item.mrp}

        </td>

        <td>

          ${item.gst}%

        </td>

        <td>

          ₹${itemTotal}

        </td>

      </tr>
    `;
  }
);

// ======================================
// TOTALS
// ======================================

const discount = 120;

const net =

  gross +
  totalGST -
  discount;

// ======================================
// UPDATE
// ======================================

document.getElementById(
  "gross"
).innerText =

  gross.toFixed(2);

document.getElementById(
  "discount"
).innerText =

  discount.toFixed(2);

document.getElementById(
  "gst"
).innerText =

  totalGST.toFixed(2);

document.getElementById(
  "net"
).innerText =

  net.toFixed(2);

// ======================================
// DOWNLOAD PDF
// ======================================

function downloadInvoice(){

  const invoice =

    document.getElementById(
      "invoice"
    );

  const options = {

    margin:0.3,

    filename:
      `${invoiceId}.pdf`,

    image:{

      type:"jpeg",

      quality:1
    },

    html2canvas:{

      scale:2
    },

    jsPDF:{

      unit:"in",

      format:"a4",

      orientation:
        "portrait"
    }
  };

  html2pdf()

    .set(options)

    .from(invoice)

    .save();
}

// ======================================
// READY
// ======================================

console.log(
  "GST Invoice Ready ✅"
);
// ======================================
// SEND WHATSAPP
// ======================================

function sendWhatsApp(){

  const mobile =
    "918530104870";

  const message =

`💊 PulseRx Invoice

Invoice ID:
${invoiceId}

Total Amount:
₹${net.toFixed(2)}

Thank You For Choosing PulseRx ❤️`;

  const url =

`https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank"
  );
}