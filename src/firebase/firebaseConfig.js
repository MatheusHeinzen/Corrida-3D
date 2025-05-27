import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCBxhuflQ8HWJVprNAMO1bha8LS2gU8BIk",
    authDomain: "rust-eze-racer.firebaseapp.com",
    databaseURL: "https://rust-eze-racer.firebaseio.com",
    projectId: "rust-eze-racer",
    storageBucket: "rust-eze-racer.appspot.com",
    messagingSenderId: "196356629173",
    appId: "1:196356629173:web:abd2c2fc1706681449d4fc",
    measurementId: "G-PE3LDBFC2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, db, auth };