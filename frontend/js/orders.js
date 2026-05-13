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
// LOAD ORDERS
// ======================================

async function loadOrders(){

  try{

    const response =

      await fetch(

        "https://cloudship-app-584731333956.asia-south1.run.app/orders"
      );

    const result =

      await response.json();

    let orders =

      result.data || [];

    // FILTER USER

    orders = orders.filter(

      order =>

        order.mobile === mobile
    );

    // SEARCH

    const search =

      document.getElementById(
        "search"
      )

      .value
      .toLowerCase();

    orders = orders.filter(

      order =>

        order.medicine
        ?.toLowerCase()
        .includes(search)
    );

    // CONTAINER

    const container =

      document.getElementById(
        "ordersContainer"
      );

    container.innerHTML = "";

    // STATS

    let pending = 0;

    let delivered = 0;

    // EMPTY

    if(!orders.length){

      container.innerHTML = `

        <div class="order-card">

          <h3>

            No Orders Found ❌

          </h3>

        </div>
      `;

      return;
    }

    // LOOP

    orders.forEach(order => {

      // STATUS

      let statusClass =
        "pending";

      if(

        order.status ===
        "Delivered"

      ){

        statusClass =
          "delivered";

        delivered++;
      }

      if(

        order.status ===
        "Processing"

      ){

        statusClass =
          "processing";
      }

      if(

        order.status ===
        "Pending"

      ){

        pending++;
      }

      // CARD

      container.innerHTML += `

        <div class="order-card">

          <h3>

            💊 ${order.medicine}

          </h3>

          <div class="info">

            🆔 Order ID:
            ${order.id}

          </div>

          <div class="info">

            📦 Quantity:
            ${order.quantity}

          </div>

          <div class="info">

            📍 ${order.address}

          </div>

          <div class="info">

            📱 ${order.mobile}

          </div>

          <div class="info">

            🕒 ${order.createdAt}

          </div>

          <div class="
            status
            ${statusClass}
          ">

            🚚 ${order.status}

          </div>

          <div class="buttons">

            <!-- TRACK -->

            <button

              class="track"

              onclick="
                trackOrder(
                  '${order.id}'
                )
              "
            >

              Track

            </button>

            <!-- INVOICE -->

            <button

              class="invoice"

              onclick="
                openInvoice()
              "
            >

              Invoice

            </button>

            <!-- REORDER -->

            <button

              class="reorder"

              onclick="
                reorderMedicine(
                  '${order.medicine}'
                )
              "
            >

              Reorder

            </button>

          </div>

        </div>
      `;
    });

    // UPDATE STATS

    document.getElementById(
      "totalOrders"
    ).innerText =

      orders.length;

    document.getElementById(
      "pendingOrders"
    ).innerText =

      pending;

    document.getElementById(
      "deliveredOrders"
    ).innerText =

      delivered;

  }catch(error){

    console.error(
      "LOAD ERROR:",
      error
    );
  }
}

// ======================================
// TRACK ORDER
// ======================================

function trackOrder(id){

  localStorage.setItem(
    "trackOrderId",
    id
  );

  window.location.href =
    "tracking.html";
}

// ======================================
// INVOICE
// ======================================

function openInvoice(){

  window.location.href =
    "invoice.html";
}

// ======================================
// REORDER
// ======================================

function reorderMedicine(medicine){

  localStorage.setItem(

    "selectedMedicine",

    medicine
  );

  alert(
    `${medicine} Added ✅`
  );

  window.location.href =
    "dashboard.html";
}

// ======================================
// SEARCH
// ======================================

document.getElementById(
  "search"
)

.addEventListener(

  "keyup",

  loadOrders
);

// ======================================
// INIT
// ======================================

loadOrders();

// ======================================
// READY
// ======================================

console.log(
  "Orders Page Ready ✅"
);