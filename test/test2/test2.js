import { db, auth } from "./firebaseconfig.js";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// DOM elements
const authStatus = document.getElementById("auth-status");
const donationSection = document.getElementById("donation-request");
const signOutBtn = document.getElementById("signOutBtn");
const requestList = document.getElementById("requestList");

// Sign Up
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Sign up successful"))
    .catch(err => alert(err.message));
}

// Sign In
function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Signed in"))
    .catch(err => alert(err.message));
}

// Sign Out
signOutBtn.addEventListener("click", () => {
  signOut(auth).then(() => alert("Signed out"));
});

// Auth Listener
onAuthStateChanged(auth, user => {
  if (user) {
    authStatus.textContent = `Logged in as: ${user.email}`;
    donationSection.style.display = "block";
    signOutBtn.style.display = "inline-block";
  } else {
    authStatus.textContent = "You are not signed in.";
    donationSection.style.display = "none";
    signOutBtn.style.display = "none";
  }
});

// Handle Form Submission
document.getElementById("requestForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("requesterName").value;
  const reason = document.getElementById("requestReason").value;
  const amount = parseFloat(document.getElementById("requestAmount").value);

  try {
    await addDoc(collection(db, "donation_requests"), {
      name,
      reason,
      amount,
      donated: 0,
      timestamp: serverTimestamp()
    });
    alert("Request submitted!");
    document.getElementById("requestForm").reset();
  } catch (err) {
    alert(err.message);
  }
});

// Display requests in real time
const q = query(collection(db, "donation_requests"), orderBy("timestamp", "desc"));
onSnapshot(q, snapshot => {
  requestList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const request = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.classList.add("request-card");

    card.innerHTML = `
      <p><strong>${request.name}</strong> needs <strong>$${request.amount}</strong> for <em>${request.reason}</em></p>
      <p>Donated: $${request.donated}</p>
      <button onclick="donate('${id}', ${request.amount}, ${request.donated})">Donate</button>
    `;

    requestList.appendChild(card);
  });
});

// Global function (must be exposed if using modules)
window.donate = async function (docId, total, current) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be signed in to donate.");
    return;
  }

  let amount = prompt("Enter donation amount:");
  amount = parseFloat(amount);

  if (isNaN(amount) || amount <= 0) return alert("Invalid amount.");
  if (current + amount > total) {
    return alert(`You can donate up to $${total - current}`);
  }

  try {
    const docRef = doc(db, "donation_requests", docId);
    await updateDoc(docRef, {
      donated: current + amount
    });
    alert("Thank you for your donation!");
  } catch (err) {
    alert(err.message);
  }
};

// Make auth functions globally available
window.signUp = signUp;
window.signIn = signIn;

