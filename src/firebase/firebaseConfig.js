import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCBxhuflQ8HWJVprNAMO1bha8LS2gU8BIk",
    authDomain: "rust-eze-racer.firebaseapp.com",
    databaseURL: "https://rust-eze-racer-default-rtdb.firebaseio.com", // <-- ESSENCIAL
    projectId: "rust-eze-racer",
    storageBucket: "rust-eze-racer.appspot.com",
    messagingSenderId: "196356629173",
    appId: "1:196356629173:web:abd2c2fc1706681449d4fc",
    measurementId: "G-PE3LDBFC2T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
export default firebaseConfig;