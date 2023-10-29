import firebase from "firebase/compat";
import { getStorage } from "firebase/storage";

//Configuraciones de firebase
const firebaseConfig = {
    apiKey: "AIzaSyA-D8yKsIsexC6vPbjgP4raoYvUDgCWGzw",
    authDomain: "elbromas-9d1ef.firebaseapp.com",
    projectId: "elbromas-9d1ef",
    storageBucket: "elbromas-9d1ef.appspot.com",
    messagingSenderId: "273934623456",
    appId: "1:273934623456:web:13ced80e638877b2d6a685"
}

//Constantes de firebase
export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth(app);
export const db = firebase.firestore(app);
export const storage = getStorage(app);