// ======================================
// CHECK LOGIN
// ======================================

const deliveryMobile =

  localStorage.getItem(
    "deliveryMobile"
  );

if(!deliveryMobile){

  window.location.href =
    "login.html";
}

// ======================================
// LIVE CLOCK
// ======================================

const heading =

  document.querySelector(
    "h1"
  );

const clock =

  document.createElement(
    "p"
  );

clock.style.marginTop =
  "10px";

clock.style.color =
  "gray";

heading.appendChild(
  clock
);

setInterval(()=>{

  clock.innerHTML =

    new Date()
    .toLocaleTimeString();

},1000);

// ======================================
// LOGOUT
// ======================================

function logout(){

  localStorage.removeItem(
    "deliveryMobile"
  );

  alert(
    "Logged Out ✅"
  );

  window.location.href =
    "login.html";
}

console.log(
  "Delivery Dashboard Ready ✅"
);