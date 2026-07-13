import { db, auth } from "./firebaseconfig.js";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
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

const navData = document.getElementById("navbar-placeholder");

if (navData) {
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            navData.innerHTML = data;

            // Now the navbar exists in the page
            initializeNavbar();
        })
        .catch(error => {
            console.error("Error loading navbar:", error);
        });
}

let authStatus;
let signOutBtn;
let accountBtn;
let accountMenu;
const donationSection = document.getElementById("donation-request");

const requestList = document.getElementById("requestList");

const requestForm = document.getElementById("requestForm");
const confirmDonationBtn =
    document.getElementById("confirmDonation");

const closeBtn = document.querySelector(".close");
const cancelDonationBtn = document.getElementById("cancelDonation");
const modalDonationAmount = document.getElementById("modalDonationAmount");
const donationModal = document.getElementById("donationModal");



function initializeNavbar() {

    const accountBtn = document.getElementById("accountBtn");
    const accountMenu = document.getElementById("accountMenu");


    authStatus = document.getElementById("auth-status");
    signOutBtn = document.getElementById("signOutBtn");

    if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
        signOut(auth).then(() => alert("Signed out"));
    });
}

    if (!accountBtn || !accountMenu) return;

    accountBtn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();

    accountMenu.classList.toggle("show");
};

    document.onclick = function (e) {

    if (
        !accountMenu.contains(e.target) &&
        !accountBtn.contains(e.target)
    ) {
        accountMenu.classList.remove("show");
    }

};

}

window.initializeNavbar = initializeNavbar; 
window.signIn = signIn;
window.signUp = signUp;

// Close when clicking anywhere else
// if (accountBtn && accountMenu) {

//     document.addEventListener("click", function(e){

//         if(!accountBtn.contains(e.target) &&
//            !accountMenu.contains(e.target)){

//             accountMenu.style.display = "none";

//         }

//     });

// }

// Sign Up
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "Users", user.uid), {
      email: user.email,
      createdAt: new Date()
    });

    alert("Sign up successful");
  } catch (err) {
    alert(err.message);
  }
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
if (signOutBtn) {

    signOutBtn.addEventListener("click", () => {

        signOut(auth).then(() => alert("Signed out"));

    });

}

// Auth Listener
onAuthStateChanged(auth, user => {

    if (authStatus) {

        if (user) {

            authStatus.textContent = `Logged in as: ${user.email}`;

        } else {

            authStatus.textContent = "You are not signed in.";

        }

    }

    if (donationSection) {

        donationSection.style.display =
            user ? "block" : "none";

    }

    if (signOutBtn) {

        signOutBtn.style.display =
            user ? "inline-block" : "none";

    }

});

// Handle Form Submission
if (requestForm) {

    requestForm.addEventListener("submit", async e => {

        e.preventDefault();

        const name = document.getElementById("requesterName").value;
        const reason = document.getElementById("requestReason").value;
        const amount = parseFloat(document.getElementById("requestAmount").value);

        try {

            await addDoc(collection(db, "donation_requests"), {
                name,
                reason,
                amount,
                userId: auth.currentUser.uid,
                donated: 0,
                timestamp: serverTimestamp()
            });

            alert("Request submitted!");

            requestForm.reset();

        } catch(err) {

            alert(err.message);

        }

    });

}

// Display requests in real time
const q = query(collection(db, "donation_requests"), orderBy("timestamp", "desc"));
if (requestList) {
onSnapshot(q, snapshot => {
  requestList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const request = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.classList.add("request-card");

    const percent = Math.min((request.donated / request.amount) * 100, 100);

    const initial = request.name.charAt(0).toUpperCase();

    const avatarColors = [
    "#6BBF8A",
    "#6C9FF8",
    "#F4A261",
    "#C084FC",
    "#5BC0BE",
    "#E76F51",
    "#F6C453"
];

const color =
    avatarColors[
        request.name.charCodeAt(0) % avatarColors.length
    ];

    card.innerHTML = `
      <div class="card-accent"></div>

<div class="card-header">

    <div class="profile-section">

        <div class="avatar"
        style="background:${color};">
            ${initial}
        </div>

        <div>

            <h3>${request.name}</h3>

            <h4 class="reason">${request.reason}</h4>

        </div>

    </div>

    <span class="funded-badge">

        ${Math.round(percent)}%

    </span>

</div>

<div class="progress-container">

    <div class="progress-bar"
        style="width:${percent}%">
    </div>

</div>

<div class="amounts">

    <div>

        <small>Raised</small>

        <h3>₦${request.donated.toLocaleString()}</h3>

    </div>

    <div>

        <small>Goal</small>

        <h3>₦${request.amount.toLocaleString()}</h3>

    </div>

</div>

<button class="donate-btn"

onclick="openDonationModal(
'${id}',
'${request.name}',
'${request.reason}',
${request.amount},
${request.donated}
)">

Donate Now

</button>

    `;

    requestList.appendChild(card);
  });
});
}




// Global function 
let currentDonation = {};

window.openDonationModal = function(id, name, reason, total, donated){

    if(!auth.currentUser){
        alert("You must be signed in to donate.");
        return;
    }

    currentDonation={
        id,
        total,
        donated
    };

    document.getElementById("modalName").textContent=name;
    document.getElementById("modalReason").textContent=reason;

    document.getElementById("modalGoal").textContent=total;
    document.getElementById("modalRaised").textContent=donated;
    document.getElementById("modalRemaining").textContent=total-donated;
    

    

    const percent=(donated/total)*100;
    document.getElementById("modalProgress").style.width=percent+"%";

    document.getElementById("modalPercent").textContent = Math.round(percent) + "%";

    document.getElementById("modalDonationAmount").value="";

    document.getElementById("donationModal").style.display="flex";

};


if (confirmDonationBtn) {

    confirmDonationBtn.addEventListener("click", async () => {

    const amount=parseFloat(
        document.getElementById("modalDonationAmount").value
    );

    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!paymentMethod) {
    alert("Please select a payment method.");
    return;
}

    if(isNaN(amount)||amount<=0){
        alert("Enter a valid amount.");
        return;
    }

    if(currentDonation.donated+amount>currentDonation.total){
        alert("Donation exceeds remaining amount.");
        return;
    }

    try{

        // Calculate the new values first
const newDonated = currentDonation.donated + amount;

const newPercent = Math.min(
    (newDonated / currentDonation.total) * 100,
    100
);

// Animate the modal immediately
document.getElementById("modalRaised").textContent =
    newDonated.toLocaleString();

document.getElementById("modalRemaining").textContent =
    (currentDonation.total - newDonated).toLocaleString();

document.getElementById("modalPercent").textContent =
    Math.round(newPercent) + "%";

const bar = document.getElementById("modalProgress");

// Get current width
const currentPercent = currentDonation.total > 0
    ? (currentDonation.donated / currentDonation.total) * 100
    : 0;

// Start from the old width
bar.style.width = currentPercent + "%";

// Wait one frame
requestAnimationFrame(() => {

    // Animate to the new width
    bar.style.width = newPercent + "%";

});

// Wait for the animation to finish...
setTimeout(async () => {

    // NOW update Firestore
    await updateDoc(
        doc(db,"donation_requests",currentDonation.id),
        {
            donated: newDonated
        }
    );

    await addDoc(collection(db,"donations"),{

    requestId: currentDonation.id,

    donorEmail: auth.currentUser.email,

    amount: amount,

    paymentMethod: paymentMethod,

    timestamp: serverTimestamp()

});

    // Close the modal
    document.getElementById("donationModal").style.display = "none";

}, 800);

    }catch(err){
        alert(err.message);
    }

});
}

if (closeBtn && donationModal) {

    closeBtn.onclick = function () {

        donationModal.style.display = "none";

    };

}

if (cancelDonationBtn && donationModal) {

    cancelDonationBtn.onclick = function () {

        donationModal.style.display = "none";

    };

}

if (modalDonationAmount && confirmDonationBtn) {

    modalDonationAmount.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            confirmDonationBtn.click();

        }

    });

}