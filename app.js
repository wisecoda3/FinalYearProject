// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCcRkvri4Em8x45yxHCqF3GyplkM3h327I",
    authDomain: "donation-platform-4bd4a.firebaseapp.com",
    projectId: "donation-platform-4bd4a",
    storageBucket: "donation-platform-4bd4a.firebasestorage.app",
    messagingSenderId: "609010845885",
    appId: "1:609010845885:web:5c98483e18b1c088638fd4",
    measurementId: "G-S6PJBYR2NZ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);



const busta = document.getElementById("notlogoutBtn");

busta.addEventListener("click", () => {
        alert(4)
        createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

    });









    // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//     databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT_ID.appspot.com",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Handle Donation Request Submission
document.getElementById("requestForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get input values
    let name = document.getElementById("requesterName").value;
    let reason = document.getElementById("requestReason").value;
    let amount = document.getElementById("requestAmount").value;

    // Validate inputs
    if (name === "" || reason === "" || amount === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Create a new donation request object
    let requestData = {
        name: name,
        reason: reason,
        amount: amount,
        timestamp: Date.now()
    };

    // Push data to Firebase Realtime Database
    database.ref("donation_requests").push(requestData)
        .then(() => {
            alert("Donation request submitted successfully!");
            document.getElementById("requestForm").reset();
        })
        .catch(error => {
            alert("Error submitting request: " + error.message);
        });
});

// Display Donation Requests in Real-Time
database.ref("donation_requests").on("value", (snapshot) => {
    let requestList = document.getElementById("requestList");
    requestList.innerHTML = ""; // Clear list before updating

    snapshot.forEach((childSnapshot) => {
        let request = childSnapshot.val();
        
        // Create list item for each request
        let li = document.createElement("li");
        li.innerHTML = `<strong>${request.name}</strong> needs <strong>$${request.amount}</strong> for <em>${request.reason}</em>`;
        requestList.appendChild(li);
    });
});
