import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";


export default class AuthStack extends React.Component {
  render() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      );
    }
}