// ======================================
// DOM
// ======================================

const imageInput =
  document.getElementById(
    "imageInput"
  );

const preview =
  document.getElementById(
    "preview"
  );

const scanBtn =
  document.getElementById(
    "scanBtn"
  );

const loader =
  document.getElementById(
    "loader"
  );

const result =
  document.getElementById(
    "result"
  );

// ======================================
// IMAGE PREVIEW
// ======================================

imageInput.addEventListener(
  "change",
  (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload =
      function(event){

        preview.src =
          event.target.result;

        preview.style.display =
          "block";
      };

    reader.readAsDataURL(
      file
    );
  }
);

// ======================================
// COMMON MEDICINES
// ======================================

const medicineDatabase = [

  "Paracetamol",
  "Crocin",
  "Dolo",
  "Metformin",
  "Azithromycin",
  "Amoxicillin",
  "Glycomet",
  "Cetirizine",
  "Pantoprazole",
  "Vogli",
  "Insulin",
  "Aspirin",
  "Ibuprofen",
  "PCM",
  "Calpol"
];

// ======================================
// SCAN
// ======================================

scanBtn.addEventListener(
  "click",
  async () => {

    if (!imageInput.files[0]) {

      alert(
        "Upload Prescription First ❌"
      );

      return;
    }

    try {

      loader.style.display =
        "block";

      result.style.display =
        "none";

      // OCR

      const response =

        await Tesseract.recognize(

          imageInput.files[0],

          "eng",

          {

            logger: m => {

              console.log(m);
            }
          }
        );

      // TEXT

      const text =

        response.data.text
        .toLowerCase();

      console.log(text);

      // DETECTED

      let detected = [];

      medicineDatabase.forEach(med => {

        if (

          text.includes(
            med.toLowerCase()
          )

        ) {

          detected.push(med);
        }
      });

      // REMOVE DUPLICATES

      detected = [...new Set(detected)];

      // RESULT

      result.innerHTML = `

        <h2>

          💊 Detected Medicines

        </h2>
      `;

      // NO MEDICINES

      if (!detected.length) {

        result.innerHTML += `

          <div class="medicine">

            No Medicines Detected ❌

          </div>
        `;
      }

      detected.forEach(med => {

  result.innerHTML += `

    <div class="medicine">

      <div>

        ✅ ${med}

      </div>

      <button
        class="add-btn"

        onclick="
          addMedicine(
            '${med}'
          )
        "
      >

        Add To Dashboard

      </button>

    </div>
  `;
});

      loader.style.display =
        "none";

      result.style.display =
        "block";

      alert(
        "AI Scan Complete 🚀"
      );

    } catch (error) {

      console.error(error);

      loader.style.display =
        "none";

      alert(
        "Scan Failed ❌"
      );
    }
  }
);

// ======================================
// READY
// ======================================

console.log(
  "Smart AI Scanner Ready ✅"
);
// ======================================
// ADD TO DASHBOARD
// ======================================

function addMedicine(medicine){

  localStorage.setItem(
    "selectedMedicine",
    medicine
  );

  alert(
    `${medicine} Added ✅`
  );

  window.location.href =
    "dashboard.html";
}
// ======================================
// ADD TO DASHBOARD
// ======================================

function addMedicine(medicine){

  localStorage.setItem(

    "selectedMedicine",

    medicine
  );

  alert(

    `${medicine} Added To Dashboard ✅`
  );

  window.location.href =

    "dashboard.html";
}