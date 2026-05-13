// ======================================
// CHECK LOGIN
// ======================================

const mobile =

  localStorage.getItem(
    "mobile"
  );

if(!mobile){

  window.location.href =
    "login.html";
}

// ======================================
// DOM ELEMENTS
// ======================================

const orderBtn =

  document.getElementById(
    "orderBtn"
  );

const ordersContainer =

  document.getElementById(
    "ordersContainer"
  );

const prescriptionFile =

  document.getElementById(
    "prescriptionFile"
  );

const medicineInput =

  document.getElementById(
    "medicineName"
  );

const quantityInput =

  document.getElementById(
    "quantity"
  );

const priceInput =

  document.getElementById(
    "price"
  );

const totalAmountInput =

  document.getElementById(
    "totalAmount"
  );

const suggestionsBox =

  document.getElementById(
    "suggestions"
  );

// ======================================
// LOGOUT
// ======================================

function logout(){

  localStorage.clear();

  alert(
    "Logged Out Successfully ✅"
  );

  window.location.href =
    "login.html";
}

// ======================================
// AUTO FILL MEDICINE
// ======================================

setTimeout(()=>{

  const selectedMedicine =

    localStorage.getItem(
      "selectedMedicine"
    );

  if(selectedMedicine){

    medicineInput.value =
      selectedMedicine;

    localStorage.removeItem(
      "selectedMedicine"
    );
  }

},500);

// ======================================
// FILE UPLOAD
// ======================================

if(prescriptionFile){

  prescriptionFile
  .addEventListener(

    "change",

    ()=>{

      const file =

        prescriptionFile.files[0];

      if(!file){

        return;
      }

      alert(
        `${file.name} selected ✅`
      );
    }
  );
}

// ======================================
// MEDICINE DATABASE
// ======================================

const medicineDatabase = [

  "Paracetamol",
  "Crocin",
  "Dolo 650",
  "Metformin",
  "Azithromycin",
  "Amoxicillin",
  "Pantoprazole",
  "Cetirizine",
  "Calpol",
  "Insulin",
  "Glycomet",
  "Vogli",
  "Ibuprofen",
  "Aspirin",
  "Metrogyl",
  "PCM",
  "Paracip",
  "Augmentin",
  "Rantac",
  "Omeprazole",
  "Disprin",
  "Sinarest"
];

// ======================================
// LIVE MEDICINE SUGGESTIONS
// ======================================

if(medicineInput){

  medicineInput.addEventListener(

    "input",

    ()=>{

      const value =

        medicineInput.value
        .toLowerCase();

      suggestionsBox.innerHTML = "";

      // EMPTY

      if(!value){

        return;
      }

      // FILTER

      const filtered =

        medicineDatabase.filter(

          med =>

            med
            .toLowerCase()
            .includes(value)
        );

      // SHOW

      filtered.forEach(med=>{

        const div =

          document.createElement(
            "div"
          );

        div.classList.add(
          "suggestion-item"
        );

        div.innerText = med;

        // CLICK

        div.addEventListener(

          "click",

          ()=>{

            medicineInput.value =
              med;

            suggestionsBox.innerHTML =
              "";
          }
        );

        suggestionsBox.appendChild(
          div
        );
      });
    }
  );
}

// ======================================
// AUTO TOTAL CALCULATION
// ======================================

function calculateTotal(){

  const qty =

    Number(
      quantityInput.value
    );

  const price =

    Number(
      priceInput.value
    );

  // EMPTY

  if(!qty || !price){

    totalAmountInput.value =
      "";

    return;
  }

  // TOTAL

  const total =

    qty * price;

  totalAmountInput.value =

    `₹${total}`;
}

// ======================================
// EVENTS
// ======================================

if(quantityInput){

  quantityInput.addEventListener(

    "input",

    calculateTotal
  );
}

if(priceInput){

  priceInput.addEventListener(

    "input",

    calculateTotal
  );
}

// ======================================
// PLACE ORDER
// ======================================

if(orderBtn){

  orderBtn.addEventListener(

    "click",

    async ()=>{

      // VALUES

      const medicineName =

        medicineInput
        .value
        .trim();

      const quantity =

        quantityInput
        .value
        .trim();

      const price =

        priceInput
        .value
        .trim();

      const totalAmount =

        totalAmountInput
        .value
        .trim();

      // VALIDATION

      if(

        !medicineName ||
        !quantity ||
        !price

      ){

        alert(
          "Fill all fields ❌"
        );

        return;
      }

      // USER DETAILS

      const name =

        prompt(
          "Enter Your Name 👤"
        );

      if(!name){

        alert(
          "Name Required ❌"
        );

        return;
      }

      const address =

        prompt(
          "Enter Delivery Address 📍"
        );

      if(!address){

        alert(
          "Address Required ❌"
        );

        return;
      }

      try{

        // API

        const response =

          await fetch(

            "http://localhost:5000/order",

            {

              method:"POST",

              headers:{

                "Content-Type":
                  "application/json"
              },

              body:JSON.stringify({

                name,
                mobile,
                address,

                medicine:
                  medicineName,

                quantity,
                price,
                total:
                  totalAmount,

                status:
                  "Pending"
              })
            }
          );

        const data =

          await response.json();

        // ERROR

        if(!data.success){

          alert(
            data.error
          );

          return;
        }

        // DATE

        const date =

          new Date()
          .toLocaleString();

        // CARD

        const orderCard =

          document.createElement(
            "div"
          );

        orderCard.classList.add(
          "order-item"
        );

        orderCard.innerHTML = `

          <h3>

            💊 ${medicineName}

          </h3>

          <p>

            📦 Quantity:
            ${quantity}

          </p>

          <p>

            💰 Price:
            ₹${price}

          </p>

          <p>

            🧾 Total:
            ${totalAmount}

          </p>

          <p>

            📍 ${address}

          </p>

          <p>

            📱 ${mobile}

          </p>

          <p>

            🆔 Order ID:
            ${data.orderId}

          </p>

          <p>

            🕒 ${date}

          </p>

          <p style="
            color:#4ade80;
            margin-top:10px;
            font-weight:600;
          ">

            Order Placed Successfully ✅

          </p>
        `;

        // ADD TOP

        if(ordersContainer){

          ordersContainer.prepend(
            orderCard
          );
        }

        // CLEAR

        medicineInput.value = "";
        quantityInput.value = "";
        priceInput.value = "";
        totalAmountInput.value = "";

        // SOUND

        const audio =

          new Audio(

            "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3"
          );

        audio.play();

        // SUCCESS

        alert(
          "Medicine Ordered Successfully 🚀"
        );

      }catch(error){

        console.error(
          "ORDER ERROR:",
          error
        );

        alert(
          "Order Failed ❌"
        );
      }
    }
  );
}

// ======================================
// LIVE CLOCK
// ======================================

const topbar =

  document.querySelector(
    ".topbar"
  );

if(topbar){

  const clock =

    document.createElement(
      "div"
    );

  clock.style.fontSize =
    "15px";

  clock.style.color =
    "#cbd5e1";

  topbar.appendChild(
    clock
  );

  setInterval(()=>{

    const now =
      new Date();

    clock.innerHTML =

      now.toLocaleTimeString();

  },1000);
}

// ======================================
// DEMO ORDERS
// ======================================

const demoOrders = [

  {

    medicine:
      "Paracetamol",

    quantity:2
  },

  {

    medicine:
      "Crocin",

    quantity:1
  }
];

// ======================================
// SHOW DEMO ORDERS
// ======================================

if(ordersContainer){

  demoOrders.forEach(order=>{

    const orderCard =

      document.createElement(
        "div"
      );

    orderCard.classList.add(
      "order-item"
    );

    orderCard.innerHTML = `

      <h3>

        💊 ${order.medicine}

      </h3>

      <p>

        Quantity:
        ${order.quantity}

      </p>

      <p>

        Status:
        Processing 🚚

      </p>
    `;

    ordersContainer.appendChild(
      orderCard
    );
  });
}

// ======================================
// FUTURE FEATURES 🚀
// ======================================

// TODO:
// AI Medicine Recommendation

// TODO:
// Voice Search Medicine

// TODO:
// Online Payment Gateway

// TODO:
// Real Delivery Boy GPS

// TODO:
// WhatsApp Invoice Send

// TODO:
// AI Doctor Chatbot

// ======================================
// READY
// ======================================

console.log(
  "Dashboard Ready 🚀"
);