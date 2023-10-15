import { Text, StyleSheet, View, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { Component } from "react";
import { AntDesign } from "@expo/vector-icons";

import { color, iconSize } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import FontStyle from "../style/FontStyle";

import { storage, db , auth } from "../config/firebase";
import { deleteObject, ref } from "firebase/storage";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import ContainerStyles from "../style/ContainerStyles";

export default class Meme extends Component {

  state = {
    datosMeme: null,
    funcionUsuario: null
  }

  componentDidMount(){
    const { datos, visitaUsuario } = this.props;

    this.setState({datosMeme: datos, funcionUsuario: visitaUsuario});
  }

  borrarMeme = async () =>{
    const {datosMeme} = this.state;

    const desertRef = ref(storage, `meme/${datosMeme.fecha}`);
    deleteObject(desertRef).then(async() => {
      await db.collection("memes").doc(datosMeme.id).delete()
    }).catch((error) => {
      console.log(error);
    });
  }

  reaccion = async() => {
    const referencia = db.collection("memes");

    if(!this.state.datosMeme.likes.includes(auth.currentUser.uid)){
      await referencia.doc(this.state.datosMeme.id).update({
        likes: arrayUnion(auth.currentUser.uid)
      }).catch(error => console.log(error));
    }else{
      await referencia.doc(this.state.datosMeme.id).update({
        likes: arrayRemove(auth.currentUser.uid)
      }).catch(error => console.log(error));
    }

    this.recargarMeme();
  }

  recargarMeme = async () =>{
    const { datos, visitaUsuario } = this.props;
    const referenciaMemes = db.collection("memes").doc(datos.id);

    referenciaMemes.get().then((doc) => {
        if(doc.exists){
          this.setState({ datosMeme: { id: doc.id, ...doc.data() } });
        }
      })
      .catch((error) => {
        console.error('Error al obtener datos: ', error);
      });
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
              <Image
                style={styles.imagenPerfil}
                source={require("../img/no-profile-image.png")}
              ></Image>
            ):(
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

        {/* Mostrar meme */}
        {datosMeme !== null && (
          <Image
            style={styles.imagenMeme}
            source={{uri: datosMeme.photoURL}}
            resizeMode="contain"
          ></Image>
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

          {/* Borrar un meme */}
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
