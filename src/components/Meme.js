//Importar Librerias React-Native
import { Text, StyleSheet, View, Image, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import React, { Component } from "react";
import { AntDesign } from "@expo/vector-icons";

//Importar Estilos
import { color, iconSize } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import FontStyle from "../style/FontStyle";
import ContainerStyles from "../style/ContainerStyles";

//Importar modulos y configs
import { verificarError } from "../config/funciones";
import { auth } from "../config/firebase";
import { borrar , reaccionar , obtenerPorId } from "../modules/MemeModule";

//Exporta componente de un post o meme para que pueda ser utilizado en las pantallas
export default class Meme extends Component {

  //datosMeme guarda la infomacion del meme
  //funcionUsuario guarda la funcion que dirige al perfil del usuario que publico el meme
  //loading se encarga de mostrar la bolita cuando reacciono al meme
  state = {
    datosMeme: null,
    funcionUsuario: null,
    loading: false
  }

  //Funcion que se ejecuta cuando se inicia el componente
  componentDidMount(){
    //Se recibe el meme consultado por props
    const { datos, visitaUsuario } = this.props;

    //Se pone el meme en el estado
    this.setState({datosMeme: datos, funcionUsuario: visitaUsuario});
  }

  //Funcion que se encarga de borrar un meme
  borrarMeme = async () =>{
    //Ejecuta la funcion "borrar" del modulo de memes, por medio de la informacion del meme guardad en el estado
    const resultado = await borrar(this.state.datosMeme);

    //Si no retorna "completado" muestra el error en el post
    if(resultado !== "completado"){
      this.setState({errorMessage: verificarError(resultado)});
    }
  }

  //Funcion que se encarga de reaccionar a un meme
  reaccion = async() => {
    //Se establece el estado loading como verdadero para que aparezca la bolita
    this.setState({loading:true});

    //Ejecuta la funcion "reaccionar" del modulo de memes, por medio de la informacion del meme guardada en el estado
    const resultado = await reaccionar(this.state.datosMeme);
    if(resultado !== "completado"){
      this.setState({errorMessage: verificarError(resultado)});
    }

    //Recargar el meme para mostrar los cambios
    await this.recargarMeme();

    //Se establece el estado loading como falso para que desaparezca la bolita
    this.setState({loading:false});
  }

  //Funcion que se encarga de recargar el meme cuando se interactua con este
  recargarMeme = async () =>{
    //Consultar el meme nuevamente desde el modulo memes, utilizando al funcion "obtenerPorId"
    const resultado = await obtenerPorId(this.state.datosMeme.id)
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    
    //Establecer el meme en el estado
    this.setState({datosMeme: resultado});
  }

  //Funcion que muestra TODO lo que se ve en el componente
  render() {
    const { datosMeme, funcionUsuario } = this.state;
    const { memePerfil } = this.props;
    return (
      <View style={UtilidadesStyle.marginVertical10}>

        {/*Informacion del Usuario*/}
        <TouchableOpacity onPress={funcionUsuario} style={ContainerStyles.contenedorHorizontal}>

          {/* 
            Foto de perfil del usuario que publico el meme
            En caso de que el usuario no tenga una URL de foto de perfil, se muestra la "foto de no perfil" guarda en el directorio "img"
            En caso de que el usuario tenga una URL de foto de perfil, se carga la foto subida a internet
          */}
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
              
              {/* 
                Mostrar iconos de reacciones 
                Cuando el estado loading es true, se muestra la bolita
              */}
              
              {this.state.loading === true?(
                <ActivityIndicator
                  color={color.negro}
                  size={iconSize.medium}
                ></ActivityIndicator>
                
              ):!datosMeme.likes.includes(auth.currentUser.uid)? (
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
