import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Public endpoint
document.getElementById("public-endpoint-btn").addEventListener("click", () => {
    document.getElementById("public-output").textContent = "Accessing public data...";
});

// Private endpoint
document.getElementById("private-endpoint-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        document.getElementById("private-output").textContent = `Welcome, ${userCredential.user.email}`;
        document.getElementById("private-output").className = "success";
    } catch (error) {
        document.getElementById("private-output").textContent = `Error: ${error.message}`;
        document.getElementById("private-output").className = "error";
    }
});
