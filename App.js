import { LogBox } from "react-native";
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

LogBox.ignoreLogs([
  "Require cycles"
])

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