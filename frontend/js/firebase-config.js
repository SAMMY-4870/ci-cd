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
    "AIzaSyAixZe9nBiihflCD0cbZWKBogccQYjhkC0",

  authDomain:
    "cloudship-495014.firebaseapp.com",

  projectId:
    "cloudship-495014",

  storageBucket:
    "cloudship-495014.firebasestorage.app",

  messagingSenderId:
    "584731333956",

  appId:
    "1:584731333956:web:62f6f8e7c7756ccb70f311"
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