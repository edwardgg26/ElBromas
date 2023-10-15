import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import firebase from "firebase/compat";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA-D8yKsIsexC6vPbjgP4raoYvUDgCWGzw",
    authDomain: "elbromas-9d1ef.firebaseapp.com",
    projectId: "elbromas-9d1ef",
    storageBucket: "elbromas-9d1ef.appspot.com",
    messagingSenderId: "273934623456",
    appId: "1:273934623456:web:13ced80e638877b2d6a685"
}

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const db = firebase.firestore(app);
const storage = getStorage(app);

export {
    app,
    auth,
    db,
    storage
}