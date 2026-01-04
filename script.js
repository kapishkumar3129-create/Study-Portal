// ----------------------------------------------------------------
// FILENAME: script.js
// ----------------------------------------------------------------
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- GLOBAL AUTHENTICATION CHECK ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is logged in - Load Profile
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                const role = data.role || 'user';
                
                updateUI(user.email, role);

                // Show Admin Features if Owner
                if (role === 'owner') {
                    const adminLink = document.getElementById('adminLink');
                    const uploadLink = document.getElementById('uploadLink');
                    if (adminLink) adminLink.style.display = 'flex';
                    if (uploadLink) uploadLink.style.display = 'flex';
                }
            } else {
                updateUI(user.email, 'user');
            }
        } catch (e) {
            console.error("Erro loading profile:", e);
        }
    } else {
        // User is NOT logged in - Redirect unless on auth page
        const path = window.location.pathname;
        if (!path.includes("login.html") && !path.includes("register.html") && !path.includes("forgot.html")) {
            window.location.href = "login.html";
        }
    }
});

// --- UI UPDATE HELPER ---
function updateUI(email, role) {
    const name = email.split('@')[0];
    const initial = name.charAt(0).toUpperCase();

    const els = {
        userInitial: document.getElementById('userInitial'),
        largeInitial: document.getElementById('largeInitial'),
        usernameDisplay: document.getElementById('usernameDisplay'),
        pUsername: document.getElementById('pUsername'),
        roleDisplay: document.getElementById('roleDisplay')
    };

    if (els.userInitial) els.userInitial.innerText = initial;
    if (els.largeInitial) els.largeInitial.innerText = initial;
    if (els.usernameDisplay) els.usernameDisplay.innerText = name;
    if (els.pUsername) els.pUsername.innerText = name;
    if (els.roleDisplay) els.roleDisplay.innerText = role.toUpperCase();
}

// --- SYSTEM FUNCTIONS ---
window.logout = async () => {
    await signOut(auth);
    window.location.href = "login.html";
};

window.toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
};
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-theme");

window.toggleProfile = () => {
    const d = document.getElementById("pDropdown");
    if (d) d.style.display = (d.style.display === "block") ? "none" : "block";
};

// --- SIDEBAR LOGIC ---
window.openNav = () => {
    document.getElementById("mySidebar").style.width = "300px";
    const main = document.getElementById("main");
    if (main) main.style.marginLeft = "300px";
};

window.closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
    const main = document.getElementById("main");
    if (main) main.style.marginLeft = "0";
};

// Dropdowns
const dropdowns = document.getElementsByClassName("dropdown-btn");
for (let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content) {
            content.style.display = (content.style.display === "block") ? "none" : "block";
        }
    });
}
const subDropdowns = document.getElementsByClassName("sub-dropdown-btn");
for (let i = 0; i < subDropdowns.length; i++) {
    subDropdowns[i].addEventListener("click", function (e) {
        e.stopPropagation();
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content) {
            content.style.display = (content.style.display === "block") ? "none" : "block";
        }
    });
}