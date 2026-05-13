// ======================================
// TOKEN CHECK
// ======================================

const token =

  localStorage.getItem(
    "token"
  );

if(!token){

  window.location.href =
    "../login.html";
}

// ======================================
// DELIVERY BOY NAME
// ======================================

// TEMP DELIVERY BOY

const deliveryBoy =

  "Rahul";

// ======================================
// LOAD ORDERS
// ======================================

async function loadOrders(){

  try{

    // LOADING

    document.querySelector(
      ".container"
    ).innerHTML = `

      <h1 style="
        color:white;
        text-align:center;
        margin-top:40px;
      ">

        Loading Orders...

      </h1>
    `;

    // API

    const response =

      await fetch(

        "https://cloudship-app-584731333956.asia-south1.run.app/orders"
      );

    const result =

      await response.json();

    const data =

      result.data || [];

    // FILTER ONLY ASSIGNED

    const assignedOrders =

      data.filter(order=>

        order.deliveryBoy ===

        deliveryBoy
      );

    // CLEAR

    document.querySelector(
      ".container"
    ).innerHTML = `

      <h1>

        📦 Assigned Orders

      </h1>
    `;

    // EMPTY

    if(!assignedOrders.length){

      document.querySelector(
        ".container"
      ).innerHTML += `

        <div style="
          margin-top:40px;
          text-align:center;
          color:white;
        ">

          No Orders Assigned 🚚

        </div>
      `;

      return;
    }

    // LOOP

    assignedOrders.forEach(order=>{

      document.querySelector(
        ".container"
      ).innerHTML += `

        <div class="order-card">

          <!-- MEDICINE -->

          <h2>

            💊
            ${order.medicine}

          </h2>

          <!-- ORDER ID -->

          <p>

            🆔
            ${order.id}

          </p>

          <!-- CUSTOMER -->

          <p>

            👤
            ${order.name}

          </p>

          <!-- ADDRESS -->

          <p>

            📍
            ${order.address}

          </p>

          <!-- MOBILE -->

          <p>

            📱
            ${order.mobile}

          </p>

          <!-- QTY -->

          <p>

            📦 Qty:
            ${order.quantity}

          </p>

          <!-- STATUS -->

          <p
            style="
              margin-top:10px;
              color:#2563eb;
              font-weight:600;
            "
          >

            🚚
            ${order.status}

          </p>

          <!-- BUTTONS -->

          <div style="
            display:flex;
            gap:10px;
            flex-wrap:wrap;
            margin-top:20px;
          ">

            <!-- ACCEPT -->

            <button

              onclick="
                acceptOrder(
                  '${order.id}'
                )
              "

              style="
                flex:1;
                padding:12px;
                border:none;
                border-radius:12px;
                background:#10b981;
                color:white;
                cursor:pointer;
              "
            >

              Accept

            </button>

            <!-- TRACK -->

            <button

              onclick="
                window.location.href=
                'tracking.html'
              "

              style="
                flex:1;
                padding:12px;
                border:none;
                border-radius:12px;
                background:#2563eb;
                color:white;
                cursor:pointer;
              "
            >

              Track

            </button>

            <!-- DELIVERED -->

            <button

              onclick="
                markDelivered(
                  '${order.id}'
                )
              "

              style="
                flex:1;
                padding:12px;
                border:none;
                border-radius:12px;
                background:#7c3aed;
                color:white;
                cursor:pointer;
              "
            >

              Delivered

            </button>

          </div>

        </div>
      `;
    });

  }catch(error){

    console.error(
      "LOAD ERROR:",
      error
    );

    document.querySelector(
      ".container"
    ).innerHTML = `

      <h1 style="
        color:red;
        text-align:center;
        margin-top:40px;
      ">

        Failed To Load Orders ❌

      </h1>
    `;
  }
}

// ======================================
// ACCEPT ORDER
// ======================================

async function acceptOrder(id){

  try{

    await fetch(

      `https://cloudship-app-584731333956.asia-south1.run.app/order/${id}`,

      {

        method:"PUT",

        headers:{

          "Content-Type":
            "application/json",

          "Authorization":
            token
        },

        body:JSON.stringify({

          status:
            "Out for Delivery"
        })
      }
    );

    alert(
      "Order Accepted 🚚"
    );

    loadOrders();

  }catch(error){

    console.error(
      "ACCEPT ERROR:",
      error
    );
  }
}

// ======================================
// MARK DELIVERED
// ======================================

async function markDelivered(id){

  try{

    await fetch(

      `https://cloudship-app-584731333956.asia-south1.run.app/order/${id}`,

      {

        method:"PUT",

        headers:{

          "Content-Type":
            "application/json",

          "Authorization":
            token
        },

        body:JSON.stringify({

          status:
            "Delivered"
        })
      }
    );

    alert(
      "Order Delivered ✅"
    );

    loadOrders();

  }catch(error){

    console.error(
      "DELIVERY ERROR:",
      error
    );
  }
}

// ======================================
// AUTO REFRESH
// ======================================

setInterval(
  loadOrders,
  5000
);

// ======================================
// INITIAL LOAD
// ======================================

loadOrders();

// ======================================
// READY
// ======================================

console.log(
  "Delivery Orders Ready 🚚"
);