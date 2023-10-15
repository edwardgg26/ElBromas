import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import {auth, db} from "../config/firebase";
import { verificarErrorFirebase } from "../config/funciones";

export default class RegisterScreen extends React.Component {

  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMessage: null
  }

  handleSingUp = async () => {
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
      const referenciaUsuario = db.collection("users").where("username","==",username);
      referenciaUsuario.get().then((doc) => {
        if (doc.exists) {
          this.setState({errorMessage: "Ya hay un usuario registrado con ese username."});
        } else {
          auth.createUserWithEmailAndPassword(email,password)
          .then(async(result) => {
            const referencia = db.collection("users");
            await referencia.doc(result.user.uid).set({
              username: username,
              email: email,
              photoURL: ""
            })
            .catch(error=>this.setState({errorMessage: verificarErrorFirebase(error.code,error.message)}));
          })
          .catch(error => this.setState({errorMessage: verificarErrorFirebase(error.code,error.message)}));
        }
      })
      .catch((error) => {
        this.setState({errorMessage: verificarErrorFirebase(error.code,error.message)});
      });  
    }
  }

  probarContenido = async() => {
    const referenciaUsuario = db.collection("users").where("username","==",this.state.username);
      referenciaUsuario.get().then((doc) => {
        if (doc.exists) {
          console.log("Ya existe ese username");
        } else {
          console.log("No exite un documento con ese username")
        }
      })
      .catch((error) => {
        this.setState({errorMessage: verificarErrorFirebase(error.code,error.message)});
      });  
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
              onChangeText={username => this.setState({username})}
              value={this.props.username}
              autoCapitalize="none"></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Email</Text>
            <TextInput
              placeholder="Ingresa tu email..."
              style={FormularioStyle.input}
              onChangeText={email => this.setState({email})}
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
              onChangeText={password => this.setState({password})}
              value={this.props.password}
              autoCapitalize="none"></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              value={this.props.confirmPassword}
              autoCapitalize="none"></TextInput>
          </View>
        </View>

        <TouchableOpacity onPress={this.handleSingUp}>
          <Text style={[FormularioStyle.botonBase,
                        FormularioStyle.botonAzul, 
                        UtilidadesStyle.marginVertical10]}>Crear Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.probarContenido}>
            <Text style={[FormularioStyle.botonBase, 
                          FormularioStyle.botonSubrayado, 
                          UtilidadesStyle.marginVertical10,
                          UtilidadesStyle.alinearIzquierda]}>Probar contenido</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Login")}>
            <Text style={[FormularioStyle.botonBase, 
                          FormularioStyle.botonSubrayado, 
                          UtilidadesStyle.marginVertical10,
                          UtilidadesStyle.alinearIzquierda]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}