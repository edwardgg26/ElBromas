import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import { TextInput } from "react-native-gesture-handler";
import firebase from "firebase/compat";

export default class RegisterScreen extends React.Component {

  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: "",
    errorMessage: null
  }

  handleSingUp = () => {
    const {username,email,password,confirmPassword} = this.state;

    if(!username){
      this.setState({errorMessage: "Debe ingresar un nombre de usuario"});
    } else if (!email){
      this.setState({errorMessage: "Debe ingresar un email"});
    }else if(password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/)){
      this.setState({errorMessage: "La contraseña debe contener por lo menos 8 caracteres, combinando mayusculas, minusculas y numeros"});
    }else if(password !== confirmPassword){
      this.setState({errorMessage: "Las contraseñas no coinciden"});
    }else{
      firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(async(result) => {
        await result.user.updateProfile({displayName: username,photoURL:""});
      })
      .catch(error => error.code === "auth/invalid-email" ? this.setState({errorMessage: "Debe ingresar un correo valido"})
                      :this.setState({errorMessage: "Hubo un error al crear el usuario"}));
    }
  }

  render(){
    return (
      <View style={[GlobalStyles.contenedorCentrado, GlobalStyles.contenidoPantalla]}>
        <Text style={GlobalStyles.titulo}>Crear Cuenta</Text>
        <View>
          {this.state.errorMessage && <Text style={GlobalStyles.error}>{this.state.errorMessage}</Text>}
        </View>

        <View style={GlobalStyles.form}>
          <View>
            <Text>Nombre de Usuario</Text>
            <TextInput
              placeholder="Ingresa tu apodo unico..."
              style={GlobalStyles.input}
              onChangeText={username => this.setState({username})}
              value={this.props.username}
              autoCapitalize="none"></TextInput>
          </View>
          <View>
            <Text>Email</Text>
            <TextInput
              placeholder="Ingresa tu email..."
              style={GlobalStyles.input}
              onChangeText={email => this.setState({email})}
              value={this.props.email}
              keyboardType="email-address"
              autoCapitalize="none"></TextInput>
          </View>

          <View>
            <Text>Contraseña</Text>
            <TextInput
              placeholder="Ingresa tu contraseña..."
              style={GlobalStyles.input}
              secureTextEntry
              onChangeText={password => this.setState({password})}
              value={this.props.password}
              autoCapitalize="none"></TextInput>
          </View>

          <View>
            <Text>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña..."
              style={GlobalStyles.input}
              secureTextEntry
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              value={this.props.confirmPassword}
              autoCapitalize="none"></TextInput>
          </View>
        </View>

        <TouchableOpacity onPress={this.handleSingUp}>
          <Text style={GlobalStyles.botonAzul}>Crear Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Login")} style={GlobalStyles.alinearIzquierda}>
            <Text style={GlobalStyles.botonSubrayado}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}