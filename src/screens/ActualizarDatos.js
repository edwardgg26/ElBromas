import { Text, View, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React from "react";

import FontStyle from "../style/FontStyle";
import FormularioStyle from "../style/FormularioStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import Header from "../components/Header";
import TabMenu from "../components/TabMenu";
import BotonBase from "../components/BotonBase";

import { auth } from "../config/firebase";
import { verificarError } from "../config/funciones";
import UserViewModel from "../viewmodel/UserViewModel";

export default class ActualizarDatos extends React.Component {
  state = {
    displayName: "",
    comparaDisplayname: "",
    password: "",
    confirmPassword: "",
    passwordActual: "",
    errorMessage: null,
    loading: false
  };

  async componentDidMount(){
    //Se consulta la informacion del usuario desde le viewmodel al cargar la pantalla 
    //y se almacena en el estado
    await UserViewModel.obtener(auth.currentUser.uid)
    .then(result => this.setState({ displayName: result.username, comparaDisplayname: result.username}))
    .catch(error => this.setState({errorMessage: verificarError(error.code)}));
  }

  actualizarUsuario = async() => {

    this.setState({loading: true});
    //Editar informacion
    const respuesta = await UserViewModel.editarInformacion(this.state);
    
    //Cambiar a pantalla de perfil o mostrar error en caso de haberlo
    if(respuesta === "completado"){
      this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid});
    }else{
      this.setState({errorMessage: verificarError(respuesta), loading: false});
    }
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

          {/* Mensaje de error */}
          <View style={UtilidadesStyle.marginVertical10}>
            {this.state.errorMessage && (
              <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          {/* Campos del formulario */}
          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Nombre de Usuario</Text>
            <TextInput
              placeholder="Ingresa tu apodo unico..."
              style={FormularioStyle.input}
              onChangeText={(displayName) => this.setState({ displayName, errorMessage: null })}
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
              onChangeText={(password) => this.setState({ password, errorMessage: null })}
              value={this.state.password}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña nueva..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword, errorMessage: null })
              }
              value={this.state.confirmPassword}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View style={UtilidadesStyle.marginVertical10}>
            <Text style={FontStyle.parrafo}>Contraseña Actual</Text>
            <TextInput
              placeholder="Tu contraseña actual..."
              style={FormularioStyle.input}
              secureTextEntry
              onChangeText={(passwordActual) =>
                this.setState({ passwordActual, errorMessage: null })
              }
              value={this.state.passwordActual}
              autoCapitalize="none"
            ></TextInput>
          </View>

          {/* Botones del formulario */}
          <BotonBase tipo="azul" funcion={this.actualizarUsuario} texto="Actualizar" loadButton={true}/>
          <BotonBase tipo="gris" funcion={()=>this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid})} texto="Cancelar" loadButton={false}/>
        </ScrollView>

        <TabMenu
          home={() => this.props.navigation.navigate("Home",{id: -2})}
          subirMeme={() => this.props.navigation.navigate("Subir")}
          categories={() => this.props.navigation.navigate("Categories")}
          profile={() => this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid})}
        />
      </View>
    );
  }
}
