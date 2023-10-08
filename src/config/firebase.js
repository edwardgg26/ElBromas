import {getFirestore} from "firebase/firestore";
import firebase from "firebase/compat";

const firebaseConfig = {
    apiKey: "AIzaSyA-D8yKsIsexC6vPbjgP4raoYvUDgCWGzw",
    authDomain: "elbromas-9d1ef.firebaseapp.com",
    projectId: "elbromas-9d1ef",
    storageBucket: "elbromas-9d1ef.appspot.com",
    messagingSenderId: "273934623456",
    appId: "1:273934623456:web:13ced80e638877b2d6a685"
}

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    app,
    db
}