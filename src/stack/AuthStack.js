import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from 'react'
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export default class AuthStack extends React.Component {
    
  render() {
    const AuthStack = createStackNavigator();
    const Auth = () => (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
  }
}