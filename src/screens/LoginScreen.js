import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import { TextInput } from "react-native-gesture-handler";
import firebase from "firebase/compat";

export default class LoginScreen extends React.Component {

  state = {
    email: "",
    password: "",
    errorMessage: null
  }

  handleLogin = ()=>{
    const {email,password} = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email,password)
      .catch(error => this.setState({errorMessage: error.message}));
  }

  render(){
    return (
      <View style={[GlobalStyles.contenedorCentrado, GlobalStyles.contenidoPantalla]}>
        <Text style={GlobalStyles.titulo}>Iniciar Sesión</Text>
        <View>
          {this.state.errorMessage && <Text style={GlobalStyles.error}>{this.state.errorMessage}</Text>}
        </View>
  
        <View style={GlobalStyles.form}>
          <View>
            <Text>Email</Text>
            <TextInput 
              keyboardType="email-address"
              placeholder="Ingresa tu email..."
              style={GlobalStyles.input} 
              onChangeText={email => this.setState({email})} 
              value={this.state.email}
              autoCapitalize="none"></TextInput>
          </View>
  
          <View>
            <Text>Contraseña</Text>
            <TextInput 
              placeholder="Ingresa tu contraseña..."
              style={GlobalStyles.input} 
              secureTextEntry 
              onChangeText={password => this.setState({password})} 
              value={this.state.password}
              autoCapitalize="none"></TextInput>
          </View>
        </View>
  
        <TouchableOpacity onPress={this.handleLogin}>
            { this.state.loading ? (
            <ActivityIndicator style={GlobalStyles.botonAzul} color="#ffffff" size="small"></ActivityIndicator>
            ):(
              <Text style={GlobalStyles.botonAzul}>Ingresar</Text>
            )}
        </TouchableOpacity>
  
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Register")} style={GlobalStyles.alinearIzquierda}>
            <Text style={GlobalStyles.botonSubrayado}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
}