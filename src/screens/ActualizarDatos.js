import {
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import firebase from "firebase/compat";
import Header from "../components/Header";
import TabMenu from "../components/TabMenu";

export default class ActualizarDatos extends React.Component {
  state = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMessage: null
  };

  componentDidMount(){
    const {email, displayName} = firebase.auth().currentUser;

    this.setState({email,displayName});
  }

  actualizarUsuario = () => {
    const {displayName,password,confirmPassword} = this.state;

    firebase
        .auth()
        .signInWithEmailAndPassword(firebase.auth().currentUser.email,confirmPassword.trim())
        .then(async(result)=> {

          if(displayName.trim() !== result.user.displayName){
            await result.user.updateProfile({displayName: displayName})
          }

          if(password){
            if(password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/)){
              this.setState({errorMessage: "La contraseña debe contener por lo menos 8 caracteres, combinando mayusculas, minusculas y numeros"});
            }else{
              await result.user.updatePassword(password);
            }
          }

          this.props.navigation.navigate("Home");
        })
        .catch(error => error.code === "auth/missing-password" ? this.setState({errorMessage: "Debe ingresar la contraseña original"})
                        : error.code === "auth/invalid-login-credentials" ? this.setState({errorMessage: "Contraseña original incorrecta"})
                        : this.setState({errorMessage: error.message/*"Hubo un error al actualizar datos"*/}));

    // if(displayName.trim() !== firebase.auth().currentUser.displayName){
    //   await firebase.auth().currentUser.updateProfile({displayName: displayName})
    //   .then(result => console.log("Uname actualizado"))
    //   .catch(error => this.setState({errorMessage: "Hubo un error al actualizar el nombre de usuario"}));
    // }

    // if(password){
    //   if(password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/)){
    //     this.setState({errorMessage: "La contraseña debe contener por lo menos 8 caracteres, combinando mayusculas, minusculas y numeros"});
    //   }else{
    //     firebase
    //     .auth()
    //     .signInWithEmailAndPassword(firebase.auth().currentUser.email,confirmPassword.trim())
    //     .then(async(result)=> {
    //       await result.user.updatePassword(password);
    //       this.props.navigation.navigate("Home");
    //     })
    //     .catch(error => error.code === "auth/missing-password" ? this.setState({errorMessage: "Debe ingresar una contraseña"})
    //                     : error.code === "auth/invalid-login-credentials" ? this.setState({errorMessage: "Contraseña incorrecta"})
    //                     : this.setState({errorMessage: "Hubo un error al actualizar la contraseña"}));
    //   }
    // }
  }

  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header />
        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Actualizar Datos</Text>
          
          <View>
          {this.state.errorMessage && <Text style={GlobalStyles.error}>{this.state.errorMessage}</Text>}
          </View>

          <View>
            <Text>Nombre de Usuario</Text>
            <TextInput
              placeholder="Ingresa tu apodo unico..."
              style={GlobalStyles.input}
              onChangeText={(displayName) => this.setState({ displayName })}
              value={this.state.displayName}
              autoCapitalize="none"
            ></TextInput>
          </View>
          
          <View>
            <Text>Contraseña Nueva</Text>
            <TextInput
              placeholder="Si quieres cambiar tu contraseña, ingresa una nueva..."
              style={GlobalStyles.input}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View>
            <Text>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña..."
              style={GlobalStyles.input}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              value={this.state.confirmPassword}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <TouchableOpacity onPress={this.actualizarUsuario}>
            {this.state.loading ? (
              <ActivityIndicator
                style={GlobalStyles.botonAzul}
                color="#ffffff"
                size="small"
              ></ActivityIndicator>
            ) : (
              <Text style={GlobalStyles.botonAzul}>Actualizar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
            style={GlobalStyles.alinearIzquierda}
          >
            <Text style={GlobalStyles.botonSubrayado}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>

        <TabMenu
          home={() => this.props.navigation.navigate("Home")}
          categories={() => this.props.navigation.navigate("Categories")}
          profile={() => this.props.navigation.navigate("Profile")}
        />
      </View>
    );
  }
}
