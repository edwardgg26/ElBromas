import { Text, View, ActivityIndicator } from 'react-native'
import React from 'react';
import firebase from "firebase/compat";
import ContainerStyles from '../style/ContainerStyles';

export default class LoadingScreen extends React.Component {
  componentDidMount(){
    firebase.auth().onAuthStateChanged( user => {
        this.props.navigation.navigate(user ? "App":"Auth");
      }
    )
  }

  render(){
    return (
      <View style={ContainerStyles.contenedorCentrado}>
        <Text>Cargando...</Text>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    )
  }
}