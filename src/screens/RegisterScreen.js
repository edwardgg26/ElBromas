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

export default class RegisterScreen extends React.Component {

  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    loading: false,
    errorMessage: null
  }

  handleSingUp = async () => {
    this.setState({loading: true});
    const respuesta = await UserViewModel.crear(this.state);
    if(respuesta !== "completado"){
      this.setState({errorMessage: verificarError(respuesta)});
    }
    this.setState({loading: false});
  }

  render(){
    return (
      <View style={[ContainerStyles.contenedorCentrado, 
                    UtilidadesStyle.width80Perc, 
                    ContainerStyles.contenidoPantalla]}>
        
        <Text style={[FontStyle.titulo, UtilidadesStyle.marginVertical10]}>Crear Cuenta</Text>

        <View>
          {this.state.errorMessage && <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>}
        </View>

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

        <BotonBase tipo="azul" funcion={this.handleSingUp} texto="Crear Cuenta" loadButton={true}/>
        <BotonBase tipo="subra" funcion={()=>this.props.navigation.navigate("Login")} texto="Cancelar" loadButton={false}/>
      </View>
    );
  }
}