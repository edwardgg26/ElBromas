import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HomeScreen from "../screens/HomeScreen";
import SubirMeme from "../screens/SubirMeme";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditarFotoPerfil from "../screens/EditarFotoPerfil";
import ActualizarDatos from "../screens/ActualizarDatos";
import NotificationScreen from "../screens/NotificationScreen";

export default class AppStack extends React.Component {
  render() {
      const Stack = createStackNavigator();

      return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Subir" component={SubirMeme} />
            <Stack.Screen name="EditarFoto" component={EditarFotoPerfil} />
            <Stack.Screen name="Actualizar" component={ActualizarDatos} />
            <Stack.Screen name="Noti" component={NotificationScreen} />
        </Stack.Navigator>
      );
    }
}
  