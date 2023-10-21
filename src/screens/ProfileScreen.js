import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import React from "react";
import { SimpleLineIcons , Ionicons } from "@expo/vector-icons";

import FontStyle from "../style/FontStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import { color, iconSize } from "../style/VariablesStyle";
import ContainerStyles from "../style/ContainerStyles";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import Meme from "../components/Meme";

import { auth } from "../config/firebase";
import MemeViewModel from "../viewmodel/MemeViewModel";
import UserViewModel from "../viewmodel/UserViewModel";
import { verificarError } from "../config/funciones";

export default class ProfileScreen extends React.Component {
  state = {
    infoUsuario: null,
    errorMessage: false,
    memes: []
  };

  async componentDidMount() {
    const {uid} = this.props.navigation.state.params;

    this.cargarUsuario(uid);
  }

  async componentDidUpdate(prevProps,prevState){
    const {uid} = this.props.navigation.state.params;

    if(this.state.memes !== prevState.memes || this.props !== prevProps){
      this.cargarUsuario(uid);
    }
  }

  cargarUsuario = async(uid) => {
    //Cargar el usuario por medio del id de este dado por props
    const infoUsuario = await UserViewModel.obtener(uid)
    .catch(error => this.setState({errorMessage: verificarError(error)}));

    //Cargar los memes por medio del id del usuario dado por props
    const memes = await MemeViewModel.obtenerPorUsuario(uid)
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    this.setState({ infoUsuario , memes });
  }

  recargarUsuario = async() => {
    const {uid} = this.props.navigation.state.params;
    this.cargarUsuario(uid);
  }

  singOutUser = async() => {
    const respuesta = await UserViewModel.cerrarSesion();

    if(respuesta !== "completado"){
      this.setState({errorMessage: verificarError(respuesta)});
    }
  };

  render() {

    const { infoUsuario , memes } = this.state;
    const {uid} = this.props.navigation.state.params;

    return (

      <View style={ContainerStyles.contenedorPantalla}>
        <Header />
        
        <ScrollView style={ContainerStyles.contenidoPantalla}>
          <View style={UtilidadesStyle.width60Perc}>

            {/* Foto de perfil del usuario */}
            {(infoUsuario === null || infoUsuario.photoURL === "")?(
              <Image style={styles.imagenPerfil} source={require("../img/no-profile-image.png")}></Image>
            ):(
              <Image style={styles.imagenPerfil} source={{ uri: infoUsuario.photoURL }}></Image>
            )}

            {/* Boton para Editar foto de perfil */}
            {(auth.currentUser.uid === uid)?(
              <TouchableOpacity onPress={() => this.props.navigation.navigate("EditarFoto")}>
                <Ionicons name="pencil" style={[UtilidadesStyle.alinearDerecha, UtilidadesStyle.marginVertical10]} size={iconSize.medium} color={color.azul} />
              </TouchableOpacity>
            ):null}
          </View>
          
          {/* Mostrar Nombre de usuario */}
          <Text style={[FontStyle.subtitulo, 
                        UtilidadesStyle.alinearCenter, 
                        UtilidadesStyle.marginVertical10]}>
            {infoUsuario !== null && (
              infoUsuario.username
            )}
          </Text>

          {/* Mostrar Informacion del usuario */}
          <View>
            <Text style={[FontStyle.subtitulo, 
                          UtilidadesStyle.alinearCenter, 
                          UtilidadesStyle.marginVertical10]}>
              Información del Usuario
            </Text>

            {/* Mostrar email del usuario */}
            <View style={UtilidadesStyle.marginVertical10}>

              <Text style={[FontStyle.parrafo,UtilidadesStyle.marginVertical10]}>Correo: {infoUsuario !== null && (infoUsuario.email)}</Text>
            </View>

            {/* Mostrar username */}
            <View style={[ContainerStyles.contenedorHorizontal, 
                         ContainerStyles.contenedorHorizontalSeparado]}>

              <Text style={[FontStyle.parrafo,
                            UtilidadesStyle.marginVertical10, 
                            UtilidadesStyle.alinearIzquierda]}>Username: {infoUsuario !== null && (infoUsuario.username)}</Text>

              {/* Mostrar boton para editar usuario */}
              {(auth.currentUser.uid === uid)?(
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Actualizar")}
                >
                  <Ionicons name="pencil" style={UtilidadesStyle.alinearDerecha} size={iconSize.medium} color={color.azul} />
                </TouchableOpacity>
              ):null}
            </View>

            {/* Mostrar boton para cerrar sesion */}
            {(auth.currentUser.uid === uid)?(
              <TouchableOpacity onPress={this.singOutUser}>
                <Text style={[FontStyle.parrafo, 
                              UtilidadesStyle.colorRed, 
                              UtilidadesStyle.marginVertical10]}>Cerrar Sesión</Text>
              </TouchableOpacity>


            ):null}
            
          </View>
          
          {/* Mostrar memes del usuario */}
          {memes.length !== 0 && (  

            <View style={[ContainerStyles.contenedorHorizontal , ContainerStyles.contenedorHorizontalSeparado]}>
              <Text style={[FontStyle.subtitulo, 
                            UtilidadesStyle.alinearIzquierda,
                            UtilidadesStyle.marginVertical10]}>
                Memes Publicados
              </Text>

              <TouchableOpacity onPress={this.recargarUsuario}>
                <SimpleLineIcons name="reload" size={iconSize.medium} color={color.negro} />
              </TouchableOpacity>
            </View>
          
          )}
          
          {memes.length !== 0 && memes.map((dato) => (
              <Meme key={dato.id} memePerfil = {true} visitaUsuario = {()=>this.props.navigation.navigate("Profile",{uid: dato.user.uid})} datos={dato} />
          ))}
          
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

const styles = StyleSheet.create({
  imagenPerfil: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginTop: 35,
    backgroundColor: color.gris
  },
  imagenMeme: {
    width: "100%",
    backgroundColor: "#000000",
  },
  username: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
