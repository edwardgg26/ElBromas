import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { auth } from "./src/config/firebase";

import AppStack from "./src/stack/AppStack";
import AuthStack from "./src/stack/AuthStack";

export default class App extends React.Component {

  state = {
    isLogged: false
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      user ? this.setState({isLogged:true}) : this.setState({isLogged:false});
    })
  }

  render(){
    return (
      <NavigationContainer>
        {this.state.isLogged?<AppStack/>:<AuthStack/>}
      </NavigationContainer>
    );
  }
}
