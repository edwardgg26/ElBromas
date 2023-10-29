import { Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

import BotonBase from "../components/BotonBase";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import { verificarError } from "../config/funciones";
import { ingresar } from "../modules/UserModule";

export default class LoginScreen extends React.Component {

  state = {
    email: "",
    password: "",
    errorMessage: null
  }

  handleLogin = async()=>{
    //Se llama la funcion "ingresar" del modulo de usuarios y se le pasa el estado
    //El cual contiene el email y contraseña
    const respuesta = await ingresar(this.state);

    //La funcion devuelve una respuesta, en caso de no ser "completado" se imprime el error
    if(respuesta !== "completado"){
      this.setState({errorMessage: verificarError(respuesta)});
    }
  }

  render(){
    return (
      <View style={[ContainerStyles.contenedorCentrado, UtilidadesStyle.width80Perc , ContainerStyles.contenidoPantalla]}>
        <Text style={[FontStyle.titulo, UtilidadesStyle.marginVertical10]}>Iniciar Sesión</Text>

        {/* Mensaje de error */}
        <View>
          {this.state.errorMessage && <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>}
        </View>
      
        {/* Campos del formulario */}
        <View>
          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Correo:</Text>
            <TextInput 
              keyboardType="email-address"
              placeholder="Ingresa tu email..."
              style={FormularioStyle.input} 
              onChangeText={email => this.setState({email, errorMessage: null})} 
              value={this.state.email}
              autoCapitalize="none"></TextInput>
          </View>
  
          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Contraseña:</Text>
            <TextInput 
              placeholder="Ingresa tu contraseña..."
              style={FormularioStyle.input} 
              secureTextEntry 
              onChangeText={password => this.setState({password, errorMessage: null})} 
              value={this.state.password}
              autoCapitalize="none"></TextInput>
          </View>
        </View>
        
        {/* Seccion de botones */}
        <BotonBase tipo="azul" funcion={this.handleLogin} texto="Ingresar" loadButton={true}/>
        <BotonBase tipo="subra" funcion={()=>this.props.navigation.navigate("Register")} texto="Crear Cuenta" loadButton={false}/>
      </View>
    );
  }
  
}