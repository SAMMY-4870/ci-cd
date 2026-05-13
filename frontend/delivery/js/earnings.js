// ======================================
// DELIVERY BOY EARNINGS
// ======================================

// TEMP DATA

const earningsData = {

  total:4200,

  today:450,

  completed:45,

  bonus:800
};

// ======================================
// LOAD EARNINGS
// ======================================

function loadEarnings(){

  // TOTAL

  document.getElementById(
    "totalEarning"
  ).innerText =

    `₹${earningsData.total}`;

  // TODAY

  document.getElementById(
    "todayEarning"
  ).innerText =

    `₹${earningsData.today}`;

  // COMPLETED

  document.getElementById(
    "completedOrders"
  ).innerText =

    earningsData.completed;

  // BONUS

  document.getElementById(
    "bonusAmount"
  ).innerText =

    `₹${earningsData.bonus}`;
}

// ======================================
// BONUS ALERT
// ======================================

function showBonus(){

  alert(

    "🎉 Complete 10 More Deliveries To Earn ₹500 Bonus 🚚"
  );
}

// ======================================
// AUTO UPDATE
// ======================================

setInterval(()=>{

  console.log(
    "Refreshing Earnings 🚀"
  );

},5000);

// ======================================
// READY
// ======================================

loadEarnings();

console.log(
  "Earnings System Ready 💰"
);