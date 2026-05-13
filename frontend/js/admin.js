// =====================================
// TOKEN CHECK
// =====================================

const token =

  localStorage.getItem(
    "token"
  );

if(!token){

  window.location.href =
    "login.html";
}

// =====================================
// LOAD ORDERS
// =====================================

async function loadOrders(){

  try{

    // LOADING

    document.getElementById(
      "orders"
    ).innerHTML = `

      <h2 style="
        color:#cbd5e1;
        text-align:center;
        margin-top:40px;
      ">

        Loading Orders...

      </h2>
    `;

    // API

    const res =

      await fetch(
        "https://cloudship-app-584731333956.asia-south1.run.app/orders"
      );

    const result =

      await res.json();

    const data =

      result.data || [];

    // SEARCH

    const search =

      document.getElementById(
        "search"
      )
      .value
      .toLowerCase();

    // FILTER

    const filtered =

      data.filter(order=>

        order.name
        ?.toLowerCase()
        .includes(search)
      );

    // CLEAR

    document.getElementById(
      "orders"
    ).innerHTML = "";

    // EMPTY

    if(!filtered.length){

      document.getElementById(
        "orders"
      ).innerHTML = `

        <h2 style="
          color:#cbd5e1;
          text-align:center;
          margin-top:40px;
        ">

          No Orders Found ❌

        </h2>
      `;

      return;
    }

    // STATS

    let pending = 0;

    let delivered = 0;

    let processing = 0;

    let assigned = 0;

    // LOOP

    filtered.forEach(order=>{

      // STATUS COUNT

      if(order.status === "Pending"){

        pending++;
      }

      if(order.status === "Processing"){

        processing++;
      }

      if(order.status === "Assigned"){

        assigned++;
      }

      if(order.status === "Delivered"){

        delivered++;
      }

      // STATUS COLOR

      let statusColor =
        "#facc15";

      if(order.status === "Delivered"){

        statusColor =
          "#4ade80";
      }

      if(order.status === "Processing"){

        statusColor =
          "#c084fc";
      }

      if(order.status === "Assigned"){

        statusColor =
          "#60a5fa";
      }

      // CARD

      document.getElementById(
        "orders"
      ).innerHTML += `

        <div class="card">

          <!-- NAME -->

          <div class="name">

            ${order.name || "Unknown"}

          </div>

          <!-- ORDER ID -->

          <div class="info">

            🆔
            ${order.id}

          </div>

          <!-- MOBILE -->

          <div class="info">

            📱
            ${order.mobile || "-"}

          </div>

          <!-- ADDRESS -->

          <div class="info">

            📍
            ${order.address || "-"}

          </div>

          <!-- MEDICINE -->

          <div class="info">

            💊
            ${order.medicine || "-"}

          </div>

          <!-- QUANTITY -->

          <div class="info">

            📦 Qty:
            ${order.quantity || 1}

          </div>

          <!-- DELIVERY BOY -->

          <div class="info">

            🚚 Delivery Boy:

            <b>

              ${
                order.deliveryBoy ||

                "Not Assigned"
              }

            </b>

          </div>

          <!-- STATUS -->

          <div
            class="info"
            style="
              color:${statusColor};
              font-weight:600;
            "
          >

            🚚 Status:
            ${order.status || "Pending"}

          </div>

          <!-- DATE -->

          <div class="info">

            🕒
            ${order.createdAt || "-"}

          </div>

          <!-- STATUS SELECT -->

          <select
            class="status"

            onchange="
              updateStatus(
                '${order.id}',
                this.value
              )
            "
          >

            <option
              ${
                order.status ==
                "Pending"

                ? "selected"

                : ""
              }
            >

              Pending

            </option>

            <option
              ${
                order.status ==
                "Processing"

                ? "selected"

                : ""
              }
            >

              Processing

            </option>

            <option
              ${
                order.status ==
                "Assigned"

                ? "selected"

                : ""
              }
            >

              Assigned

            </option>

            <option
              ${
                order.status ==
                "Out for Delivery"

                ? "selected"

                : ""
              }
            >

              Out for Delivery

            </option>

            <option
              ${
                order.status ==
                "Delivered"

                ? "selected"

                : ""
              }
            >

              Delivered

            </option>

          </select>

          <!-- ASSIGN DELIVERY -->

          <div
            style="
              margin-top:15px;
            "
          >

            <select

              id="delivery-${order.id}"

              style="
                width:100%;
                padding:12px;
                border:none;
                border-radius:10px;
                background:#1e293b;
                color:white;
                margin-bottom:10px;
              "
            >

              <option value="">

                🚚 Select Delivery Boy

              </option>

              <option value="Rahul">

                Rahul

              </option>

              <option value="Akash">

                Akash

              </option>

              <option value="Sam">

                Sam

              </option>

            </select>

            <button

              class="delete"

              style="
                background:
                  linear-gradient(
                    to right,
                    #10b981,
                    #059669
                  );
              "

              onclick="
                assignDelivery(
                  '${order.id}'
                )
              "
            >

              Assign Delivery Boy

            </button>

          </div>

          <!-- TRACK -->

          <button

            class="delete"

            style="
              background:
                linear-gradient(
                  to right,
                  #2563eb,
                  #7c3aed
                );
              margin-top:15px;
            "

            onclick="
              window.open(
                'tracking.html',
                '_blank'
              )
            "
          >

            Track Order

          </button>

          <!-- DELETE -->

          <button

            class="delete"

            onclick="
              deleteOrder(
                '${order.id}'
              )
            "
          >

            Delete Order

          </button>

        </div>
      `;
    });

    // UPDATE STATS

    document.getElementById(
      "total"
    ).innerText =
      filtered.length;

    document.getElementById(
      "pending"
    ).innerText =
      pending;

    document.getElementById(
      "delivered"
    ).innerText =
      delivered;

    // ACTIVE USERS

    const uniqueUsers =

      new Set(

        filtered.map(
          o=>o.mobile
        )
      );

    document.getElementById(
      "activeUsers"
    ).innerText =
      uniqueUsers.size;

  }catch(error){

    console.error(
      "LOAD ERROR:",
      error
    );

    document.getElementById(
      "orders"
    ).innerHTML = `

      <h2 style="
        color:red;
        text-align:center;
        margin-top:40px;
      ">

        Failed To Load Orders ❌

      </h2>
    `;
  }
}

// =====================================
// UPDATE STATUS
// =====================================

async function updateStatus(
  id,
  status
){

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

          status
        })
      }
    );

    loadOrders();

  }catch(error){

    console.error(
      "UPDATE ERROR:",
      error
    );
  }
}

// =====================================
// ASSIGN DELIVERY
// =====================================

async function assignDelivery(
  orderId
){

  try{

    const deliveryBoy =

      document.getElementById(

        `delivery-${orderId}`

      ).value;

    // VALIDATION

    if(!deliveryBoy){

      alert(
        "Select Delivery Boy ❌"
      );

      return;
    }

    // API

    const response =

      await fetch(

        `https://cloudship-app-584731333956.asia-south1.run.app/order/${orderId}`,

        {

          method:"PUT",

          headers:{

            "Content-Type":
              "application/json",

            "Authorization":
              token
          },

          body:JSON.stringify({

            deliveryBoy,

            status:
              "Assigned"
          })
        }
      );

    const data =

      await response.json();

    // SUCCESS

    if(data.success){

      alert(
        `Assigned To ${deliveryBoy} 🚚`
      );

      loadOrders();

    }else{

      alert(
        "Assignment Failed ❌"
      );
    }

  }catch(error){

    console.error(
      "ASSIGN ERROR:",
      error
    );

    alert(
      "Server Error ❌"
    );
  }
}

// =====================================
// DELETE ORDER
// =====================================

async function deleteOrder(id){

  try{

    await fetch(

      `https://cloudship-app-584731333956.asia-south1.run.app/order/${id}`,

      {

        method:"DELETE",

        headers:{

          "Authorization":
            token
        }
      }
    );

    loadOrders();

  }catch(error){

    console.error(
      "DELETE ERROR:",
      error
    );
  }
}

// =====================================
// LOGOUT
// =====================================

function logout(){

  localStorage.clear();

  alert(
    "Logged Out ✅"
  );

  window.location.href =
    "login.html";
}

// =====================================
// AUTO REFRESH
// =====================================

setInterval(
  loadOrders,
  20000
);

// =====================================
// INITIAL LOAD
// =====================================

loadOrders();

// =====================================
// READY
// =====================================

console.log(
  "Admin Panel Ready 🚀"
);