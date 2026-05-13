// ======================================
// DELIVERY LOGIN
// ======================================

const loginBtn =

  document.getElementById(
    "loginBtn"
  );

if(loginBtn){

  loginBtn.addEventListener(

    "click",

    ()=>{

      const mobile =

        document.getElementById(
          "mobile"
        ).value.trim();

      const password =

        document.getElementById(
          "password"
        ).value.trim();

      // VALIDATION

      if(!mobile || !password){

        alert(
          "Fill all fields ❌"
        );

        return;
      }

      // DEMO LOGIN

      localStorage.setItem(
        "deliveryMobile",
        mobile
      );

      alert(
        "Delivery Login Success ✅"
      );

      window.location.href =
        "dashboard.html";
    }
  );
}

console.log(
  "Delivery Login Ready ✅"
);