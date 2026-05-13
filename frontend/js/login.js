// =====================================
// ELEMENTS
// =====================================

const passwordTab =

  document.getElementById(
    "passwordTab"
  );

const otpTab =

  document.getElementById(
    "otpTab"
  );

const passwordForm =

  document.getElementById(
    "passwordForm"
  );

const otpForm =

  document.getElementById(
    "otpForm"
  );

// =====================================
// TAB SWITCHING
// =====================================

passwordTab.addEventListener(

  "click",

  ()=>{

    passwordTab.classList.add(
      "active"
    );

    otpTab.classList.remove(
      "active"
    );

    passwordForm.classList.remove(
      "hidden"
    );

    otpForm.classList.add(
      "hidden"
    );
  }
);

otpTab.addEventListener(

  "click",

  ()=>{

    otpTab.classList.add(
      "active"
    );

    passwordTab.classList.remove(
      "active"
    );

    otpForm.classList.remove(
      "hidden"
    );

    passwordForm.classList.add(
      "hidden"
    );
  }
);

// =====================================
// PASSWORD LOGIN
// =====================================

passwordForm.addEventListener(

  "submit",

  async (e)=>{

    e.preventDefault();

    // CLEAR OLD SESSION

    localStorage.clear();

    // INPUTS

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
        "Please fill all fields ❌"
      );

      return;
    }

    try{

      // API CALL

      const response =

        await fetch(

          "http://localhost:5000/login",

          {

            method:"POST",

            headers:{

              "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

              mobile,
              password
            })
          }
        );

      // JSON

      const data =

        await response.json();
      console.log(data);

      // DEBUG

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      // SUCCESS

      if(data.success){

        // SAVE TOKEN

        localStorage.setItem(

          "token",

          data.token
        );

        // SAVE MOBILE

        localStorage.setItem(

          "mobile",

          data.mobile
        );

        // SAVE ROLE

        localStorage.setItem(

          "role",

          data.role
        );

        // SUCCESS ALERT

        alert(
          `Login Successful As ${data.role} ✅`
        );

        // =====================================
        // ROLE BASED REDIRECT
        // =====================================

        // ADMIN

        if(

          data.role ===
          "admin"

        ){

          console.log(
            "Redirecting To Admin 🚀"
          );

          window.location.href =

            "admin.html";

          return;
        }

        // DELIVERY

        if(

          data.role ===
          "delivery"

        ){

          console.log(
            "Redirecting To Delivery 🚚"
          );

          window.location.href =

            "delivery/dashboard.html";

          return;
        }

        // USER

        console.log(
          "Redirecting To User Dashboard 👤"
        );

        window.location.href =

          "dashboard.html";

      }else{

        alert(

          data.error ||

          "Login Failed ❌"
        );
      }

    }catch(error){

      console.error(

        "LOGIN ERROR:",

        error
      );

      alert(
        "Server Error ❌"
      );
    }
  }
);

// =====================================
// FIREBASE OTP SEND
// =====================================

document.getElementById(

  "sendOtpBtn"

).addEventListener(

  "click",

  async ()=>{

    const mobile =

      document.getElementById(
        "otpMobile"
      ).value.trim();

    if(!mobile){

      alert(
        "Enter Mobile Number ❌"
      );

      return;
    }

    try{

      const appVerifier =

        window.recaptchaVerifier;

      const phoneNumber =

        "+91" + mobile;

      const confirmationResult =

        await window.signInWithPhoneNumber(

          window.auth,

          phoneNumber,

          appVerifier
        );

      window.confirmationResult =

        confirmationResult;

      alert(
        "OTP Sent Successfully ✅"
      );

    }catch(error){

      console.error(
        "OTP ERROR:",
        error
      );

      alert(
        error.message
      );
    }
  }
);

// =====================================
// OTP VERIFY LOGIN
// =====================================

otpForm.addEventListener(

  "submit",

  async (e)=>{

    e.preventDefault();

    const mobile =

      document.getElementById(
        "otpMobile"
      ).value.trim();

    const otp =

      document.getElementById(
        "otp"
      ).value.trim();

    if(!mobile || !otp){

      alert(
        "Enter OTP ❌"
      );

      return;
    }

    try{

      const result =

        await window.confirmationResult.confirm(
          otp
        );

      console.log(
        "OTP VERIFIED:",
        result.user
      );

      // SAVE

      localStorage.setItem(
        "mobile",
        mobile
      );

      localStorage.setItem(
        "role",
        "user"
      );

      // SUCCESS

      alert(
        "Mobile Verified ✅"
      );

      // REDIRECT

      window.location.href =

        "dashboard.html";

    }catch(error){

      console.error(
        "OTP VERIFY ERROR:",
        error
      );

      alert(
        "Invalid OTP ❌"
      );
    }
  }
);

// =====================================
// AUTO LOGIN CHECK
// =====================================

window.addEventListener(

  "load",

  ()=>{

    const token =

      localStorage.getItem(
        "token"
      );

    const role =

      localStorage.getItem(
        "role"
      );

    if(token){

      console.log(
        `Already Logged In As ${role} ✅`
      );
    }
  }
);

// =====================================
// LOGOUT
// =====================================

function logout(){

  localStorage.clear();

  window.location.href =

    "login.html";
}

// =====================================
// FUTURE FEATURES 🚀
// =====================================

// TODO:
// Google Login

// TODO:
// Face Login

// TODO:
// Delivery Approval

// TODO:
// Admin Verification

// TODO:
// Device Login History

// TODO:
// JWT Expiry Auto Logout

// =====================================
// READY
// =====================================

console.log(
  "Login System Ready 🚀"
);