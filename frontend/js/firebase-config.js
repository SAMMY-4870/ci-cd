// ==========================================
// FIREBASE IMPORTS
// ==========================================

import {
  initializeApp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

  apiKey:
    "YOUR_API_KEY",

  authDomain:
    "YOUR_PROJECT.firebaseapp.com",

  projectId:
    "YOUR_PROJECT_ID",

  storageBucket:
    "YOUR_PROJECT.appspot.com",

  messagingSenderId:
    "YOUR_MESSAGING_SENDER_ID",

  appId:
    "YOUR_APP_ID"
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app =
  initializeApp(firebaseConfig);

// ==========================================
// AUTH
// ==========================================

const auth =
  getAuth(app);

// ==========================================
// STORAGE
// ==========================================

const storage =
  getStorage(app);

// ==========================================
// GLOBAL EXPORTS
// ==========================================

window.auth =
  auth;

window.signInWithPhoneNumber =
  signInWithPhoneNumber;

// STORAGE EXPORTS

window.storage =
  storage;

window.storageRef =
  ref;

window.uploadBytes =
  uploadBytes;

window.getDownloadURL =
  getDownloadURL;

// ==========================================
// CLEAN RECAPTCHA SETUP
// ==========================================

window.setupRecaptcha = () => {

  // PREVENT DUPLICATE CAPTCHA

  if (
    window.recaptchaVerifier
  ) {

    return;
  }

  try {

    window.recaptchaVerifier =

      new RecaptchaVerifier(

        auth,

        "sendOtpBtn",

        {

          size: "invisible",

          callback: () => {

            console.log(
              "reCAPTCHA Verified ✅"
            );
          },

          "expired-callback": () => {

            console.log(
              "reCAPTCHA Expired ⚠️"
            );
          }
        }
      );

    console.log(
      "reCAPTCHA Initialized ✅"
    );

  } catch (error) {

    console.error(
      "reCAPTCHA ERROR:",
      error
    );
  }
};

// ==========================================
// FIREBASE READY
// ==========================================

console.log(
  "Firebase Initialized ✅"
);