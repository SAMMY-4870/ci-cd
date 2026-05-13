// ======================================
// PRESCRIPTION UPLOAD
// ======================================

const uploadBtn =
  document.querySelector(
    ".upload-box button"
  );

uploadBtn.addEventListener(
  "click",
  async () => {

    const fileInput =
      document.getElementById(
        "prescriptionFile"
      );

    const file =
      fileInput.files[0];

    if (!file) {

      alert(
        "Please select file ❌"
      );

      return;
    }

    try {

      // USER

      const mobile =
        localStorage.getItem(
          "mobile"
        );

      // FILE NAME

      const fileName =

        `prescriptions/${mobile}_${Date.now()}_${file.name}`;

      // STORAGE REF

      const fileRef =

        window.storageRef(

          window.storage,

          fileName
        );

      // UPLOAD FILE

      await window.uploadBytes(

        fileRef,

        file
      );

      // GET URL

      const downloadURL =

        await window.getDownloadURL(
          fileRef
        );

      console.log(
        "FILE URL:",
        downloadURL
      );

      // SUCCESS

      alert(
        "Prescription Uploaded Successfully ✅"
      );

      // SHOW FILE

      const ordersContainer =
        document.getElementById(
          "ordersContainer"
        );

      const uploadCard =
        document.createElement(
          "div"
        );

      uploadCard.classList.add(
        "order-item"
      );

      uploadCard.innerHTML = `

        <h3>
          📄 Prescription Uploaded
        </h3>

        <p>
          ${file.name}
        </p>

        <a
          href="${downloadURL}"
          target="_blank"
          style="
            color:#60a5fa;
            text-decoration:none;
            font-weight:600;
          "
        >
          View Prescription
        </a>
      `;

      ordersContainer.prepend(
        uploadCard
      );

      // CLEAR INPUT

      fileInput.value = "";

    } catch (error) {

      console.error(
        "UPLOAD ERROR:",
        error
      );

      alert(
        error.message
      );
    }
  }
);