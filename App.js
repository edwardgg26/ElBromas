import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import HomeScreen from "./src/screens/HomeScreen";
import SubirMeme from "./src/screens/SubirMeme";
import CategoriesScreen from "./src/screens/CategoriesScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditarFotoPerfil from "./src/screens/EditarFotoPerfil";
import ActualizarDatos from "./src/screens/ActualizarDatos";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import LoadingScreen from "./src/screens/LoadingScreen";

import firebase from "firebase/compat";

const firebaseConfig = {
    apiKey: "AIzaSyA-D8yKsIsexC6vPbjgP4raoYvUDgCWGzw",
    authDomain: "elbromas-9d1ef.firebaseapp.com",
    projectId: "elbromas-9d1ef",
    storageBucket: "elbromas-9d1ef.appspot.com",
    messagingSenderId: "273934623456",
    appId: "1:273934623456:web:13ced80e638877b2d6a685"
}
firebase.initializeApp(firebaseConfig);

const AppStack = createStackNavigator({
    Home: HomeScreen,
    Categories: CategoriesScreen,
    Profile: ProfileScreen,
    Subir: SubirMeme,
    EditarFoto: EditarFotoPerfil,
    Actualizar: ActualizarDatos
},{
  headerMode: "none"
});

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen 
},{
    headerMode: "none"
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: "Loading"
    }
  )
);