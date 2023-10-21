import { Text, StyleSheet, View, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { Component } from "react";
import { AntDesign } from "@expo/vector-icons";

import { color, iconSize } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import FontStyle from "../style/FontStyle";

import { auth } from "../config/firebase";
import ContainerStyles from "../style/ContainerStyles";
import MemeViewModel from "../viewmodel/MemeViewModel";
import { verificarError } from "../config/funciones";

export default class Meme extends Component {

  state = {
    datosMeme: null,
    funcionUsuario: null
  }

  componentDidMount(){
    //Se recibe el meme consultado por props
    const { datos, visitaUsuario } = this.props;

    //Se pone el meme en el estado
    this.setState({datosMeme: datos, funcionUsuario: visitaUsuario});
  }

  borrarMeme = async () =>{
    //Eliminar el meme desde el viewmodel
    const resultado = await MemeViewModel.borrar(this.state.datosMeme);
    if(resultado !== "completado"){
      this.setState({errorMessage: verificarError(resultado)});
    }
  }

  reaccion = async() => {
    //Reaccionar al meme desde el viewmodel
    const resultado = await MemeViewModel.reaccionar(this.state.datosMeme);
    if(resultado !== "completado"){
      this.setState({errorMessage: verificarError(resultado)});
    }

    //Recargar el meme
    this.recargarMeme();
  }

  recargarMeme = async () =>{

    //Consultar el meme nuevamente desde el viewmodel
    const resultado = await MemeViewModel.obtenerPorId(this.state.datosMeme.id)
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    
    //Establecer el meme en el estado
    this.setState({datosMeme: resultado});
  }

  render() {
    const { datosMeme, funcionUsuario } = this.state;
    const { memePerfil } = this.props;
    return (
      <View style={UtilidadesStyle.marginVertical10}>

        {/*Informacion del Usuario*/}
        <TouchableOpacity onPress={funcionUsuario} style={ContainerStyles.contenedorHorizontal}>

          {/*Mostrar Foto de Perfil*/}
          {memePerfil === false?(
            (datosMeme === null || datosMeme.user.photoURL === "")?(
              //Mostrar foto de usuario sin perfil en caso de que no tenga
              <Image
                style={styles.imagenPerfil}
                source={require("../img/no-profile-image.png")}
              ></Image>
            ):(
              //Mostrar la foto en caso de que tenga una
              <Image
                style={styles.imagenPerfil}
                source={{ uri: datosMeme.user.photoURL }}
              ></Image>
            )
          ):null}
          
          {/*Mostrar Nombre de Usuario*/}
          {memePerfil === false && datosMeme !== null && (
            <Text style={[FontStyle.parrafo, 
                          UtilidadesStyle.fontWeightBold, 
                          UtilidadesStyle.marginLeft10]}>{datosMeme.user.username}</Text>
          )}
         
        </TouchableOpacity>

        {/* Mostrar imagen del meme */}
        {datosMeme !== null && (
          <Image style={styles.imagenMeme} source={{uri: datosMeme.photoURL}} resizeMode="contain"></Image>
        )}

        <View style={[ContainerStyles.contenedorHorizontal,
                      ContainerStyles.contenedorHorizontalSeparado,
                      UtilidadesStyle.marginBottom20]}>
          {datosMeme !== null && (
            //Reaccionar a una publicacion
            <TouchableOpacity onPress={this.reaccion} style={ContainerStyles.contenedorHorizontal}>
              {/* Mostrar iconos de reacciones */}
              {!datosMeme.likes.includes(auth.currentUser.uid)?(
                <AntDesign name="smileo" size={iconSize.medium} color={color.negro} />
              ):(
                <AntDesign name="smile-circle" size={iconSize.medium} color={color.negro} />
              )}
              
              {/* Mostrar numero de reacciones */}
              <Text style={[FontStyle.parrafo, UtilidadesStyle.marginLeft10]}>
                {!datosMeme.likes.length? 0 : datosMeme.likes.length}
              </Text>
            </TouchableOpacity>
          )}

          {/* Boton para borrar un meme */}
          {datosMeme !== null && memePerfil === true && datosMeme.user.uid === auth.currentUser.uid ?(
            <TouchableOpacity
              onPress={this.borrarMeme}
            >
              <AntDesign name="delete" size={iconSize.medium} color={color.rojo} />
            </TouchableOpacity>
          ):null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagenPerfil: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: color.gris
  },
  imagenMeme: {
    width: "100%",
    // marginVertical: 10,
    height: Dimensions.get("screen").width
  }
});
