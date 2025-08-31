// app.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCcRkvri4Em8x45yxHCqF3GyplkM3h327I",
    authDomain: "donation-platform-4bd4a.firebaseapp.com",
    databaseURL: "https://donation-platform-4bd4a.firebaseio.com",
    projectId: "donation-platform-4bd4a",
    storageBucket: "donation-platform-4bd4a.firebasestorage.app",
    messagingSenderId: "609010845885",
    appId: "1:609010845885:web:5c98483e18b1c088638fd4",
    measurementId: "G-S6PJBYR2NZ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const database = getFirestore();
  
  // Function to handle donation request form submission

  // let submit = document.getElementById("submit")
  // submit.addEventListener("click", function (event){
  //   alert(5)
  // })



// DOM Elements
const authStatus = document.getElementById("auth-status");
const donationSection = document.getElementById("donation-request");
const signOutBtn = document.getElementById("signOutBtn");



// Sign Up Function
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Sign up successful. You are now logged in.");
    })
    .catch(error => {
      alert(error.message);
    });
}

// Sign In Function
function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Signed in successfully.");
    })
    .catch(error => {
      alert(error.message);
    });
}


// Sign Out Function
function signOut() {
  auth.signOut()
    .then(() => {
      alert("Signed out successfully.");
    })
    .catch(error => {
      alert(error.message);
    });
}


document.getElementById("signin1").addEventListener("click", function (e) {
  e.preventDefault();
  alert(4) 

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Signed up 
  const user = userCredential.user;
  const userData ={
      email: email,
  }
  alert("creating user")
  // ...

  const docRef = doc(database,"users", user.uid)
  setDoc(docRef,userData)


})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  alert("error message")
  // ..
});
}
)










  document.getElementById("requestForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert(5) 

  //   const email = document.getElementById("email").value;
  //   const password = document.getElementById("password").value;

  //   createUserWithEmailAndPassword(auth, email, password)
  // .then((userCredential) => {
  //   // Signed up 
  //   const user = userCredential.user;
  //   alert("creating user")
  //   // ...
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   alert("error message")
  //   // ..
  // });
 
    
    
    
    // Prevent page reload
  
    // Get values from the form
    const name = document.getElementById("requesterName").value;
    const reason = document.getElementById("requestReason").value;
    const amount = document.getElementById("requestAmount").value;
  
    if (name.trim() === "" || reason.trim() === "" || amount.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }
  
    // Create a new donation request object with an initial donated amount of 0
    const requestData = {
      name: name,
      reason: reason,
      amount: Number(amount),
      donated: 0,
      timestamp: Date.now()
    };

    // const docRef = doc(database,"users", user.uid)
    // setDoc(docRef,requestData)
  
    // Push the data to the "donation_requests" node in Firebase Realtime Database
    doc.ref("donation_requests").push(requestData)
      .then(() => {
        alert("Donation request submitted successfully!");
        document.getElementById("requestForm").reset();
      })
      .catch(error => {
        alert("Error submitting request: " + error.message);
      });
  });
  
  // Function to display donation requests in real time
  doc.ref("donation_requests").on("value", (snapshot) => {
    const requestList = document.getElementById("requestList");
    requestList.innerHTML = ""; // Clear the current list
  
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const request = childSnapshot.val();
      
      // Create a container for each request
      const card = document.createElement("div");
      card.classList.add("request-card");
  
      // Build inner HTML for the request card
      card.innerHTML = `
        <p><strong>${request.name}</strong> needs <strong>$${request.amount}</strong> for <em>${request.reason}</em></p>
        <p>Donated so far: $${request.donated}</p>
        <button onclick="donate('${key}', ${request.amount}, ${request.donated})">Donate</button>
      `;
      
      requestList.appendChild(card);
    });
  });
  
  // Function to handle donations for a specific request
  function donate(requestId, totalAmount, donatedSoFar) {
    // Prompt donor for the donation amount
    let donation = prompt("Enter donation amount ($):");
    donation = parseFloat(donation);
  
    if (isNaN(donation) || donation <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
  
    // Calculate new total donated amount
    const newDonated = donatedSoFar + donation;
  
    // Ensure the donated amount does not exceed the requested amount
    if (newDonated > totalAmount) {
      alert(`Donation exceeds the requested amount. You can donate up to $${totalAmount - donatedSoFar}.`);
      return;
    }
  
    // Update the donation request in Firebase with the new donated amount
    database.ref("donation_requests/" + requestId).update({
      donated: newDonated
    })
    .then(() => {
      alert("Thank you for your donation!");
    })
    .catch(error => {
      alert("Error processing donation: " + error.message);
    });
  }
  