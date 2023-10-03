import { Text, View, ActivityIndicator } from 'react-native'
import React from 'react';
import GlobalStyles from '../GlobalStyles';
import firebase from "firebase/compat";

export default class LoadingScreen extends React.Component {
  componentDidMount(){
    firebase.auth().onAuthStateChanged( user => {
        this.props.navigation.navigate(user ? "App":"Auth");
      }
    )
  }

  render(){
    return (
      <View style={GlobalStyles.contenedorCentrado}>
        <Text>Cargando...</Text>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    )
  }
}