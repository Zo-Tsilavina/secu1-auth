import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_STORAGE_BUCKET",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
  };

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fonction login
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Enregistrer le login dans Firestore
    await addDoc(collection(db, "logins"), {
      email: user.email,
      loginAt: new Date().toISOString(),
    });

    console.log("Utilisateur connecté :", user.email);
    return user;
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message);
    throw error;
  }
};

// Événement pour le bouton "Login"
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const user = await login(email, password);
    document.getElementById("output").textContent = `Bienvenue, ${user.email}`;
  } catch (error) {
    document.getElementById("output").textContent = `Erreur : ${error.message}`;
  }
});

// Fonction pour récupérer les logins
const getLogins = async () => {
  try {
    const loginsSnapshot = await getDocs(collection(db, "logins"));
    const logins = [];

    loginsSnapshot.forEach((doc) => {
      logins.push(doc.data());
    });

    return logins;
  } catch (error) {
    console.error("Erreur lors de la récupération des connexions :", error.message);
    throw error;
  }
};

// Événement pour afficher les connexions
document.getElementById("show-logins-btn").addEventListener("click", async () => {
  try {
    const logins = await getLogins();
    const loginsListElement = document.getElementById("logins-list");

    // Vider la liste actuelle
    loginsListElement.innerHTML = "";

    // Ajouter chaque connexion à la liste
    logins.forEach((login) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Email : ${login.email} - Connecté le : ${new Date(
        login.loginAt
      ).toLocaleString()}`;
      loginsListElement.appendChild(listItem);
    });
  } catch (error) {
    document.getElementById("output").textContent = `Erreur : ${error.message}`;
  }
});
