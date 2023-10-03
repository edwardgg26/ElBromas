import { createStackNavigator } from "@react-navigation/stack";
import React from 'react'

export default class AppStack extends React.Component {
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