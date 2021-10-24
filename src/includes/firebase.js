import { initializeApp } from "firebase/app";
import * as auth from "firebase/auth";
import * as db from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBekDGnZ6HXOgQHN5pdTpXuCHa2NisidTk",
  authDomain: "amuusic-a9b77.firebaseapp.com",
  projectId: "amuusic-a9b77",
  storageBucket: "amuusic-a9b77.appspot.com",
  messagingSenderId: "624585419035",
  appId: "1:624585419035:web:5bc332b8de374f3d574bbe"
};

initializeApp(firebaseConfig);

const usersCollection = db.collection(db.getFirestore(), "users");

export { auth, db, usersCollection };
