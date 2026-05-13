// ======================================
// ELEMENTS
// ======================================

const signupForm =
  document.getElementById(
    "signupForm"
  );

const sendOtpBtn =
  document.getElementById(
    "sendOtpBtn"
  );

const passwordInput =
  document.getElementById(
    "password"
  );

const confirmPasswordInput =
  document.getElementById(
    "confirmPassword"
  );

// ======================================
// PASSWORD TOGGLE
// ======================================

function togglePassword(id) {

  const input =
    document.getElementById(id);

  if (
    input.type === "password"
  ) {

    input.type = "text";

  } else {

    input.type = "password";
  }
}

// ======================================
// OTP SEND
// ======================================

let otpSent = false;

sendOtpBtn.addEventListener(
  "click",
  async () => {

    const mobile =
      document.getElementById(
        "mobile"
      ).value.trim();

    if (!mobile) {

      alert(
        "Enter Mobile Number ❌"
      );

      return;
    }

    if (mobile.length !== 10) {

      alert(
        "Enter Valid Mobile Number ❌"
      );

      return;
    }

    try {

      // INIT CAPTCHA

      window.setupRecaptcha();

      const appVerifier =
        window.recaptchaVerifier;

      const phoneNumber =
        "+91" + mobile;

      // SEND OTP

      const confirmationResult =

        await window.signInWithPhoneNumber(

          window.auth,

          phoneNumber,

          appVerifier
        );

      window.confirmationResult =
        confirmationResult;

      otpSent = true;

      alert(
        "OTP Sent Successfully ✅"
      );

      // BUTTON CHANGE

      sendOtpBtn.innerText =
        "Resend OTP";

    } catch (error) {

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

// ======================================
// SIGNUP
// ======================================

signupForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const firstName =
      document.getElementById(
        "firstName"
      ).value.trim();

    const lastName =
      document.getElementById(
        "lastName"
      ).value.trim();

    const age =
      document.getElementById(
        "age"
      ).value.trim();

    const mobile =
      document.getElementById(
        "mobile"
      ).value.trim();

    const otp =
      document.getElementById(
        "otp"
      ).value.trim();

    const password =
      passwordInput.value.trim();

    const confirmPassword =
      confirmPasswordInput.value.trim();

    // ======================================
    // VALIDATION
    // ======================================

    if (

      !firstName ||
      !lastName ||
      !age ||
      !mobile ||
      !otp ||
      !password ||
      !confirmPassword

    ) {

      alert(
        "Please fill all fields ❌"
      );

      return;
    }

    // AGE VALIDATION

    if (age < 18) {

      alert(
        "Age must be 18+ ❌"
      );

      return;
    }

    // MOBILE VALIDATION

    if (mobile.length !== 10) {

      alert(
        "Invalid Mobile Number ❌"
      );

      return;
    }

    // OTP VALIDATION

    if (!otpSent) {

      alert(
        "Please send OTP first ❌"
      );

      return;
    }

    // PASSWORD LENGTH

    if (password.length < 8) {

      alert(
        "Password minimum 8 characters ❌"
      );

      return;
    }

    // PASSWORD MATCH

    if (
      password !== confirmPassword
    ) {

      alert(
        "Passwords do not match ❌"
      );

      return;
    }

    try {

      // VERIFY OTP

      const result =

        await window.confirmationResult.confirm(
          otp
        );

      console.log(
        "FIREBASE USER:",
        result.user
      );

      // REGISTER USER

      const response =
        await fetch(

          "http://localhost:5000/verify-otp",

          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              firstName,
              lastName,
              age,
              mobile,
              password
            })
          }
        );

      const data =
        await response.json();

      if (data.success) {

        alert(
          "Account Created Successfully ✅"
        );

        // SAVE LOCAL

        localStorage.setItem(
          "mobile",
          mobile
        );

        // REDIRECT

        window.location.href =
          "dashboard.html";

      } else {

        alert(
          data.error ||
          "Signup Failed ❌"
        );
      }

    } catch (error) {

      console.error(
        "VERIFY ERROR:",
        error
      );

      alert(
        "Invalid OTP ❌"
      );
    }
  }
);

// ======================================
// PASSWORD HINT
// ======================================

passwordInput.addEventListener(
  "focus",
  () => {

    console.log(
      "Password must contain minimum 8 characters"
    );
  }
);

// ======================================
// PASSWORD MATCH CHECK
// ======================================

confirmPasswordInput.addEventListener(
  "keyup",
  () => {

    if (

      confirmPasswordInput.value &&
      confirmPasswordInput.value !==
      passwordInput.value

    ) {

      confirmPasswordInput.style.border =
        "2px solid red";

    } else {

      confirmPasswordInput.style.border =
        "none";
    }
  }
);