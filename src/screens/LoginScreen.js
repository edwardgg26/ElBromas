import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import { auth } from "../config/firebase";
import { verificarErrorFirebase } from "../config/funciones";

export default class LoginScreen extends React.Component {

  state = {
    email: "",
    password: "",
    errorMessage: null
  }

  handleLogin = ()=>{
    const {email,password} = this.state;

    if(!email){
      this.setState({errorMessage: "Debe rellenar el campo de correo"});
    }else if (!password){
      this.setState({errorMessage: "Debe rellenar el campo de contraseña"});
    } else{
      auth.signInWithEmailAndPassword(email,password)
      .catch(error => this.setState({errorMessage: verificarErrorFirebase(error.code)}));
    }
  }

  render(){
    return (
      <View style={[ContainerStyles.contenedorCentrado, UtilidadesStyle.width80Perc , ContainerStyles.contenidoPantalla]}>
        <Text style={[FontStyle.titulo, UtilidadesStyle.marginVertical10]}>Iniciar Sesión</Text>
        <View>
          {this.state.errorMessage && <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>}
        </View>
  
        <View>
          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Correo:</Text>
            <TextInput 
              keyboardType="email-address"
              placeholder="Ingresa tu email..."
              style={FormularioStyle.input} 
              onChangeText={email => this.setState({email})} 
              value={this.state.email}
              autoCapitalize="none"></TextInput>
          </View>
  
          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Contraseña:</Text>
            <TextInput 
              placeholder="Ingresa tu contraseña..."
              style={FormularioStyle.input} 
              secureTextEntry 
              onChangeText={password => this.setState({password})} 
              value={this.state.password}
              autoCapitalize="none"></TextInput>
          </View>
        </View>
  
        <TouchableOpacity onPress={this.handleLogin}>
          <Text style={[FormularioStyle.botonBase,
                        FormularioStyle.botonAzul, 
                        UtilidadesStyle.marginVertical10]}>Ingresar</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Register")}>
            <Text style={[FormularioStyle.botonBase,
                          FormularioStyle.botonSubrayado, 
                          UtilidadesStyle.marginVertical10,
                          UtilidadesStyle.alinearIzquierda]}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
}