import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import FontStyle from "../style/FontStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import { color, iconSize } from "../style/VariablesStyle";
import ContainerStyles from "../style/ContainerStyles";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import Meme from "../components/Meme";

import { auth, db } from "../config/firebase";

export default class ProfileScreen extends React.Component {
  state = {
    infoUsuario: null,
    memes: []
  };

  componentDidMount() {
    const {uid} = this.props.navigation.state.params; 
    this.cargarDatosUsuario(uid);
    this.cargarMemesUsuario(uid);
  }

  componentDidUpdate(prevProps,prevState){
    const {uid} = this.props.navigation.state.params;
    if(this.state !== prevState){
      this.cargarMemesUsuario(uid);
    }
    if(this.props !== prevProps){
      this.cargarDatosUsuario(uid);
    }
  }

  cargarDatosUsuario = async(uid) =>{
    const referenciaUsuario = db.collection("users").doc(uid);

    referenciaUsuario.get().then((doc) => {
      if (doc.exists) {
        this.setState({ infoUsuario: { id: doc.id, ...doc.data() } });
      } else {
        console.log("No hay documento con el ID proporcionado.");
      }
    }).catch(error => {
      console.log("Error al obtener el documento: ", error);
    })
  }

  cargarMemesUsuario = async(uid) =>{

    const referenciaMemes = db.collection("memes").where("user.uid","==",uid);

    referenciaMemes.get()
      .then((querySnapshot) => {
        const datosArray = [];
        querySnapshot.forEach((doc) => {
          datosArray.push({ id: doc.id, ...doc.data() });
        });
        this.setState({memes: datosArray});
      })
      .catch((error) => {
        console.error('Error al obtener datos: ', error);
      });
  }

  singOutUser = () => {
    auth.signOut();
  };

  render() {

    const { infoUsuario,memes } = this.state;
    const {uid} = this.props.navigation.state.params; 

    return (

      <View style={ContainerStyles.contenedorPantalla}>
        <Header />
        
        <ScrollView style={ContainerStyles.contenidoPantalla}>
          <View style={UtilidadesStyle.width60Perc}>
            {/* Foto de perfil del usuario */}
            {(infoUsuario === null || infoUsuario.photoURL === "")?(
              <Image
                style={styles.imagenPerfil}
                source={require("../img/no-profile-image.png")}
              ></Image>
            ):(
              <Image
                style={styles.imagenPerfil}
                source={{ uri: infoUsuario.photoURL }}
              ></Image>
            )}

            {/* Editar foto de perfil */}
            {(auth.currentUser.uid === uid)?(
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("EditarFoto")}
              >
                <Ionicons name="pencil" style={[UtilidadesStyle.alinearDerecha, 
                                                UtilidadesStyle.marginVertical10]} size={iconSize.medium} color={color.azul} />
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
          <View>
            <Text style={[FontStyle.subtitulo, 
                          UtilidadesStyle.alinearCenter, 
                          UtilidadesStyle.marginVertical10]}>
              Información del Usuario
            </Text>

            {/* Mostrar Informacion del usuario */}
            <View style={UtilidadesStyle.marginVertical10}>

              <Text style={[FontStyle.parrafo,UtilidadesStyle.marginVertical10]}>Correo: {infoUsuario !== null && (infoUsuario.email)}</Text>
            </View>
            
            <View style={[ContainerStyles.contenedorHorizontal, 
                         ContainerStyles.contenedorHorizontalSeparado]}>

              <Text style={[FontStyle.parrafo,
                            UtilidadesStyle.marginVertical10, 
                            UtilidadesStyle.alinearIzquierda]}>Username: {infoUsuario !== null && (infoUsuario.username)}</Text>

              {(auth.currentUser.uid === uid)?(
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Actualizar")}
                >
                  <Ionicons name="pencil" style={UtilidadesStyle.alinearDerecha} size={iconSize.medium} color={color.azul} />
                </TouchableOpacity>
              ):null}
            </View>

            {(auth.currentUser.uid === uid)?(
              <TouchableOpacity onPress={this.singOutUser}>
                <Text style={[FontStyle.parrafo, 
                              UtilidadesStyle.colorRed, 
                              UtilidadesStyle.marginVertical10]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            ):null}
            
          </View>
          
          {memes.length !== 0 && (  
          <Text style={[FontStyle.subtitulo, 
                        UtilidadesStyle.alinearIzquierda,
                        UtilidadesStyle.marginVertical10]}>
            Memes Publicados
          </Text>
          )}

          {memes.length !== 0 && memes.map((dato) => (
              <Meme key={dato.id} memePerfil = {true} visitaUsuario = {()=>this.props.navigation.navigate("Profile",{uid: dato.user.uid})} datos={dato} />
          ))}
          
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
