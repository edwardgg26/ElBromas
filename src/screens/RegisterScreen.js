import { Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

import BotonBase from "../components/BotonBase";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import { verificarError } from "../config/funciones";
import { crear } from "../modules/UserModule";

export default class RegisterScreen extends React.Component {

  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMessage: null
  }

  handleSingUp = async () => {
    //Se llama la funcion "crear" del modulo de usuarios y se le pasa el estado
    //El cual contiene el email, username, contraseña y contraseña confirmada
    const respuesta = await crear(this.state);

    //La funcion devuelve una respuesta, en caso de no ser "completado" se imprime el error
    if(respuesta !== "completado"){
      this.setState({errorMessage: verificarError(respuesta)});
    }
  }

  render(){
    return (
      <View style={[ContainerStyles.contenedorCentrado, 
                    UtilidadesStyle.width80Perc, 
                    ContainerStyles.contenidoPantalla]}>
        
        <Text style={[FontStyle.titulo, UtilidadesStyle.marginVertical10]}>Crear Cuenta</Text>
        
        {/* Mensaje de error */}
        <View>
          {this.state.errorMessage && <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>}
        </View>

        {/* Campos del formulario */}
        <View>
          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Nombre de Usuario</Text>
            <TextInput
              placeholder="Ingresa tu apodo unico..."
              style={FormularioStyle.input}
              onChangeText={username => this.setState({username,errorMessage: null})}
              value={this.props.username}
              autoCapitalize="none"></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Email</Text>
            <TextInput
              placeholder="Ingresa tu email..."
              style={FormularioStyle.input}
              onChangeText={email => this.setState({email,errorMessage: null})}
              value={this.props.email}
              keyboardType="email-address"
              autoCapitalize="none"></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Contraseña</Text>
            <TextInput
              placeholder="Ingresa tu contraseña..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={password => this.setState({password,errorMessage: null})}
              value={this.props.password}
              autoCapitalize="none"></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={confirmPassword => this.setState({confirmPassword,errorMessage: null})}
              value={this.props.confirmPassword}
              autoCapitalize="none"></TextInput>
          </View>
        </View>
        
        {/* Seccion de botones */}
        <BotonBase tipo="azul" funcion={this.handleSingUp} texto="Crear Cuenta" loadButton={true}/>
        <BotonBase tipo="subra" funcion={()=>this.props.navigation.navigate("Login")} texto="Cancelar" loadButton={false}/>
      </View>
    );
  }
}