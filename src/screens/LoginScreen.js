import { Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

import BotonBase from "../components/BotonBase";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import { verificarError } from "../config/funciones";
import { color } from "../style/VariablesStyle";
import UserViewModel from "../viewmodel/UserViewModel";

export default class LoginScreen extends React.Component {

  state = {
    email: "",
    password: "",
    loading: false,
    errorMessage: null
  }

  handleLogin = async()=>{
    this.setState({loading: true});
    if(!this.state.email){
      this.setState({errorMessage: "Debe rellenar el campo de correo"});
    }else if (!this.state.password){
      this.setState({errorMessage: "Debe rellenar el campo de contraseña"});
    } else{
      const respuesta = await UserViewModel.ingresar(this.state);

      if(respuesta !== "completado"){
        this.setState({errorMessage: verificarError(respuesta)});
      }
    }
    this.setState({loading: false});
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
  
        <BotonBase tipo="azul" funcion={this.handleLogin} texto="Ingresar" loadButton={true}/>
        <BotonBase tipo="subra" funcion={()=>this.props.navigation.navigate("Register")} texto="Crear Cuenta" loadButton={false}/>
      </View>
    );
  }
  
}