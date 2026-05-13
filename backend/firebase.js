const admin =

  require("firebase-admin");

// ======================================
// FIREBASE INIT
// ======================================

if (!admin.apps.length) {

  // LOCAL ENVIRONMENT

  if (

    process.env.NODE_ENV !==

    "production"

  ) {

    const serviceAccount =

      require(
        "./service-account.json"
      );

    admin.initializeApp({

      credential:

        admin.credential.cert(
          serviceAccount
        )
    });

    console.log(

      "🔥 Firebase Local Connected"
    );

  }

  // CLOUD RUN / GCP

  else {

    admin.initializeApp({

      credential:

        admin.credential.applicationDefault()
    });

    console.log(

      "☁️ Firebase Cloud Connected"
    );
  }
}

// ======================================
// FIRESTORE
// ======================================

const db =

  admin.firestore();

module.exports = db;