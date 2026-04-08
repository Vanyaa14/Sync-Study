
// ✅ GLOBAL VARIABLES (TOP OF FILE)
let requests = [];
let allSessions = [];

let currentChatUser = null;   // ✅ ADD HERE
let chats = {};               // ✅ ADD HERE

allSessions = [
  {
    name: "Aman",
    subject: "DSA",
    faculty: "Sharma",
    time: "Now",
    location: "library",
    coords: [23.0782, 76.8521]
  },
  {
    name: "Riya",
    subject: "Maths",
    faculty: "Verma",
    time: "3pm",
    location: "ab1",
    coords: [23.0770, 76.8510]
  }
];
window.onload = function () {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    alert("Welcome back " + user.name);
  }
};
// ---------------- SCROLL ----------------

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// ---------------- SIGNUP ----------------
function signup() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let regno = document.getElementById("regno").value;

  if (!name || !email || !regno) {
    alert("Please fill all required fields!");
    return;
  }

  if (!regno.startsWith("25")) {
    alert("Invalid Registration Number!");
    return;
  }


  alert("Signup successful!");
  scrollToSection("formSection");
  localStorage.setItem("user", JSON.stringify({
  name: name,
  email: email,
  regno: regno
}));
}

// ---------------- MAP INIT (VIT BHOPAL) ----------------

// Coordinates from your Google Maps link
var map = L.map('map').setView([23.0775, 76.8513], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// ---------------- CAMPUS LOCATIONS ----------------

const locations = {
  "library": [23.0782, 76.8521],
  "ab1": [23.0770, 76.8510],
  "ab2": [23.0765, 76.8505],
  "ab3": [23.0760, 76.8500],
  "hostel": [23.0788, 76.8530],
  "cafeteria": [23.0778, 76.8525]
};

// ---------------- START SESSION ----------------

function startSession() {
  let subject = document.getElementById("subject").value;
  let faculty = document.getElementById("faculty").value;
  let time = document.getElementById("time").value;
  let locationInput = document.getElementById("locationInput").value.toLowerCase();

  if (!subject || !faculty || !time || !locationInput) {
    alert("Fill all fields!");
    return;
  }

  let coords = locations[locationInput];

  if (!coords) {
    alert("Location not found!");
    return;
  }

  // Add current user session
  let user = JSON.parse(localStorage.getItem("user"));

  let mySession = {
    name: user ? user.name : "You",
    subject,
    faculty,
    time,
    location: locationInput,
    coords
  };

  allSessions.push(mySession);

  showAllSessions();

  scrollToSection("mapSection");
}
function showAllSessions() {

  // Clear map
  map.eachLayer(function (layer) {
    if (!!layer.toGeoJSON) {
      map.removeLayer(layer);
    }
  });

  // Re-add tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Show all sessions
  allSessions.forEach(session => {

   let redIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [30, 30]
});

let blueIcon = L.icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [30, 30]
});

let user = JSON.parse(localStorage.getItem("user"));

let marker = L.marker(session.coords, {
  icon: (user && session.name === user.name) ? redIcon : blueIcon
}).addTo(map);

   marker.bindPopup(
  `<b>${session.name}</b><br>
   ${session.subject}<br>
   ${session.faculty}<br>
   ${session.time}<br>
   ${session.location}<br><br>

   <button onclick="sendRequest('${session.name}')">
     Send Request
   </button>`
);
  });
}
function sendRequest(name) {

  let request = {
    to: name,
    status: "pending"
  };

  requests.push(request);

  updateRequestsUI();   // ✅ THIS LINE MUST BE HERE

  alert("Request sent to " + name);
}
window.onload = function () {
let savedStatus = localStorage.getItem("active");

if (savedStatus === "true") {
  isActive = true;
  document.getElementById("statusBtn").innerHTML = "🟢";
}
  // Show demo users on map
  showAllSessions();

  // Welcome message
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    alert("Welcome back " + user.name);
  }


};
function updateRequestsUI() {

  let box = document.getElementById("requestsBox");

  if (!box) return;

  box.innerHTML = "";

  requests.forEach((req, index) => {

    let div = document.createElement("div");

    div.innerHTML = `
      Request to <b>${req.to}</b> - ${req.status} <br><br>

      ${
        req.status === "pending" 
        ? `<button onclick="acceptRequest(${index})">Accept</button>
           <button onclick="rejectRequest(${index})">Reject</button>`
        : ""
      }

      ${
        req.status === "accepted"
        ? `<button onclick="openChat('${req.to}')">Chat</button>`
        : ""
      }
    `;

    box.appendChild(div);
  });
}
function acceptRequest(index) {
  requests[index].status = "accepted";
  updateRequestsUI();
}
function rejectRequest(index) {
  requests[index].status = "rejected";
  updateRequestsUI();
}

let isActive = false;

function toggleActive() {

  isActive = !isActive;

  let btn = document.getElementById("statusBtn");

  if (isActive) {
    btn.innerHTML = "🟢";
    localStorage.setItem("active", "true");
  } else {
    btn.innerHTML = "🔴";
    localStorage.setItem("active", "false");
  }

}
function updateLocation() {

  let loc = prompt("Enter your location (library, ab1, etc):");

  if (!loc) return;

  loc = loc.toLowerCase();

  if (!locations[loc]) {
    alert("Invalid location!");
    return;
  }

  // ✅ Save location
  localStorage.setItem("userLocation", loc);

  // ✅ Get current user
  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please signup first!");
    return;
  }

  // ✅ Find user's session
  let found = false;

  allSessions.forEach(session => {
    if (session.name === user.name) {
      session.location = loc;
      session.coords = locations[loc];
      found = true;
    }
  });

  // ✅ If no session exists → create one
  if (!found) {
    allSessions.push({
      name: user.name,
      subject: "Not set",
      faculty: "Not set",
      time: "Now",
      location: loc,
      coords: locations[loc]
    });
  }

  // ✅ Refresh map
  showAllSessions();

  alert("Location updated to " + loc);
}
localStorage.setItem("userLocation", loc);

function openChat(name) {

  currentChatUser = name;

  if (!chats[name]) {
    chats[name] = [];
  }

  renderChat();

  // ✅ scroll to chat section (IMPORTANT)
  document.getElementById("chatBox").scrollIntoView({
    behavior: "smooth"
  });
}

function sendMessage() {
  let input = document.getElementById("chatInput");
  let msg = input.value;

  if (!msg || !currentChatUser) return;

  chats[currentChatUser].push("You: " + msg);

  input.value = "";

  renderChat();
}

function renderChat() {

  let box = document.getElementById("chatBox");

  if (!box) return;

  box.innerHTML = "";

  if (!currentChatUser) {
    box.innerHTML = "Select a chat";
    return;
  }

  // ✅ THIS LINE WAS MISSING (so it looked empty)
  box.innerHTML = "<b>Chatting with " + currentChatUser + "</b><br><br>";

  chats[currentChatUser].forEach(m => {
    let div = document.createElement("div");
    div.innerText = m;
    box.appendChild(div);
  });
}
let groups = [];

function createGroup() {

  let groupName = prompt("Enter group name:");
  if (!groupName) return;

  let members = prompt("Enter number of members:");
  if (!members) return;

  let group = {
    name: groupName,
    members: members,
    createdBy: JSON.parse(localStorage.getItem("user"))?.name || "You"
  };

  groups.push(group);

  alert("Group created: " + groupName);
}
function toggleGroupOptions() {
  let box = document.getElementById("groupOptions");

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function createOfflineGroup() {
  alert("Offline group created 📍");
}

function createOnlineGroup() {
  alert("Online group created 💻");
}
document.getElementById("fileInput").addEventListener("change", function () {

  let file = this.files[0];

  if (!file) return;

  let chatBox = document.getElementById("chatBox");

  let div = document.createElement("div");

  div.innerHTML = `📎 File sent: ${file.name}`;

  chatBox.appendChild(div);
});