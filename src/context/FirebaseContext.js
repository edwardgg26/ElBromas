import React, {createContext} from "react";
import firebase from "firebase/compat";
import "firebase/auth";
import "firebase/firestore";
import config from "../config/firebase";

const FirebaseContext = createContext();
firebase.initializeApp(config);
const db = firebase.firestore();

const Firebase = {
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },
    createUser: async (user) => {
        try{
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;
            await db.collection("users").doc(uid).set({
                username: user.username,
                email: user.email,
                profilePhotoUrl: ""
            });

            delete user.password;
            return {...user, uid};
        }catch(error){
            console.log("Error @createUser: ", error.message);
        }
    },
    getBlob: async (uri) => {
        return await new Promise ((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(xhr.response);
            }

            xhr.onerror = () => {
                reject(new TypeError("Solicitud de Red Fallida"));
            }

            xhr.responseType = "blob";
            xhr.open("GET",uri,true);
            xhr.send(null);
        })
    },
    uploadProfilePhoto: async (uri) => {
        const uid = Firebase.getCurrentUser().uid;

        try{
            const photo = await Firebase.getBlob(uri);

            const imageRef = firebase.storage().ref("profilePhotos".child(uid));
            await imageRef.put(photo);

            const url = await imageRef.getDownloadURL();
            await db.collection("users").doc(uid).update({
                profilePhotoUrl:url
            })

            return url;
        }catch(error){
            console.log("Error @uploadProfilePhoto: ", error.message);
        }
    }
}

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value= {Firebase}>{props.children}</FirebaseContext.Provider>
}

export {FirebaseContext, FirebaseProvider}