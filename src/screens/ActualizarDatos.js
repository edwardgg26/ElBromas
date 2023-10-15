import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React from "react";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";
import { color } from "../style/VariablesStyle";

import Header from "../components/Header";
import TabMenu from "../components/TabMenu";

import { auth , db } from "../config/firebase";
import { verificarErrorFirebase } from "../config/funciones";

export default class ActualizarDatos extends React.Component {
  state = {
    displayName: "",
    comparaDisplayname: "",
    password: "",
    confirmPassword: "",
    errorMessage: null
  };

  componentDidMount(){
    this.consultarUsuario();
  }

  consultarUsuario =  async() => {
    const referenciaUsuario = db.collection("users").doc(auth.currentUser.uid);

    referenciaUsuario.get().then((doc) => {
      if (doc.exists) {
        this.setState({ displayName: doc.data().username, comparaDisplayname: doc.data().username});
      } else {
        console.log("No hay documento con el ID proporcionado.");
      }
    }).catch(error => {
      console.log("Error al obtener el documento: ", error);
    })
  }

  actualizarUsuario = () => {
    const { displayName, comparaDisplayname, password, confirmPassword } = this.state;
    let error = false;
    auth.signInWithEmailAndPassword(auth.currentUser.email, confirmPassword.trim())
      .then(async (result) => {
        if(displayName.trim() !== comparaDisplayname){
          const referenciaUsuario = db.collection("users").doc(auth.currentUser.uid);
          const batch = db.batch();
          const referenciaMemes = db.collection("memes").where("user.uid","==",auth.currentUser.uid);
          batch.update(referenciaUsuario,{
            username: displayName
          });
          referenciaMemes.get().then(async querySnapshot => {
            querySnapshot.forEach((doc)=>{
              var postRef = db.collection("memes").doc(doc.id);
              batch.update(postRef, {"user.username": displayName});
            })
            await batch.commit()
            .then(result => this.props.navigation.navigate("Home"))
            .catch(error => console.log(error));
          }).catch(error => console.log(error));
        }

        if (password) {
          if (password.length < 8 || !password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/)) {
            this.setState({errorMessage: "La contraseña debe contener por lo menos 8 caracteres, combinando mayusculas, minusculas y numeros",});
          } else {
            await result.user.updatePassword(password)
            .catch(error => {
              this.setState({errorMessage: verificarErrorFirebase(error.code)})
            });
          }
        }

        this.props.navigation.navigate("Home");
        // if(error === false){
        // }
      })
      .catch(error => this.setState({errorMessage: verificarErrorFirebase(error.code)}));
  };

  render() {

    return (
      <View style={ContainerStyles.contenedorPantalla}>
        <Header />
        <ScrollView contentContainerStyle={[ContainerStyles.contenedorCentrado, 
                                            ContainerStyles.contenidoPantalla]}
                    style={[UtilidadesStyle.width80Perc]}>

          <Text style={[FontStyle.subtitulo,
                        UtilidadesStyle.alinearCenter, 
                        UtilidadesStyle.marginVertical10]}>Actualizar Datos</Text>

          <View style={UtilidadesStyle.marginVertical10}>
            {this.state.errorMessage && (
              <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Nombre de Usuario</Text>
            <TextInput
              placeholder="Ingresa tu apodo unico..."
              style={FormularioStyle.input}
              onChangeText={(displayName) => this.setState({ displayName })}
              value={this.state.displayName}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Contraseña Nueva</Text>
            <TextInput
              placeholder="Si quieres cambiar tu contraseña..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              value={this.state.confirmPassword}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View>
            <TouchableOpacity onPress={this.actualizarUsuario}>
              {/* {this.state.loading ? (
                <ActivityIndicator
                  style={GlobalStyles.botonAzul}
                  color={color.blanco}
                  size="small"
                ></ActivityIndicator>
              ) : (
                )} */}
                <Text style={[FormularioStyle.botonBase, 
                              FormularioStyle.botonAzul, 
                              UtilidadesStyle.marginVertical10]}>Actualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Profile")}
            >
              <Text style={[FormularioStyle.botonBase , 
                            FormularioStyle.botonGris,
                            UtilidadesStyle.marginVertical10]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TabMenu
          home={() => this.props.navigation.navigate("Home")}
          subirMeme={() => this.props.navigation.navigate("Subir")}
          categories={() => this.props.navigation.navigate("Categories")}
          profile={() => this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid})}
        />
      </View>
    );
  }
}
