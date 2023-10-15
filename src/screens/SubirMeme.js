import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native'
import React from 'react'
import * as ImagePicker from "expo-image-picker";

import FontStyle from '../style/FontStyle';
import FormularioStyle from '../style/FormularioStyle';
import ContainerStyles from '../style/ContainerStyles';
import UtilidadesStyle from '../style/UtilidadesStyle';
import { color } from '../style/VariablesStyle';

import Header from '../components/Header';
import TabMenu from '../components/TabMenu';

import { auth , storage, db } from '../config/firebase';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

export default class SubirMeme extends React.Component {

  state = {
    image: ""
  }

  uploadMeme = async() => {
    
    if(this.state.image){

      const response = await fetch(this.state.image);
      const blob = await response.blob();

      const referenciaUsuario = db.collection("users").doc(auth.currentUser.uid);
      const referenciaColeccion = db.collection("memes");
      const fecha = new Date().toISOString();
      
      const referenciaImagen =  ref(storage,`meme/${fecha}`);
      
      await referenciaUsuario.get()
      .then((doc) => {
        if (doc.exists) {
          uploadBytes(referenciaImagen, blob)
          .then(() => {
            getDownloadURL(referenciaImagen).then(url => {
              referenciaColeccion.doc().set({
                fecha: fecha,
                photoURL: url,
                user: {
                  uid: auth.currentUser.uid,
                  ...doc.data()
                },
                likes: []
              })
            })
          })   
          this.props.navigation.navigate("Home");
        }else{
          console.log("No hay documento con el ID proporcionado.");
        }})
      .catch((error) => {
        console.error("Error al obtener el documento: ", error);
      });
    }
  }

  pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5
    });

    if (!result.canceled) {
      this.setState({image: result.assets[0].uri});
    }
  }

  render() {
    return (
      <View style={ContainerStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={ContainerStyles.contenidoPantalla}>
          <Text style={[FontStyle.subtitulo, 
                        UtilidadesStyle.marginVertical10, 
                        UtilidadesStyle.marginTop20]}>Subir Meme</Text>

          <TouchableOpacity
            onPress={this.pickImage}
            style={[ContainerStyles.contenedorHorizontal,
                    UtilidadesStyle.marginVertical10]}
          >
            <View style={styles.imagenPerfil}>
              {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: 48, height: 48 }} />}
            </View>

            <Text style={[FontStyle.parrafo,UtilidadesStyle.marginLeft10]}>Selecciona una Imagen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={[FormularioStyle.botonBase, 
                          FormularioStyle.botonGris, 
                          UtilidadesStyle.marginVertical10]}>Selecciona una Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.uploadMeme}
          >
            <Text style={[FormularioStyle.botonBase, 
                          FormularioStyle.botonAzul,
                          UtilidadesStyle.marginVertical10]}>Subir Meme</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home")}>
            <Text style={[FormularioStyle.botonBase, 
                          FormularioStyle.botonGris,
                          UtilidadesStyle.marginVertical10]}>Cancelar</Text>
          </TouchableOpacity>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow:'hidden',
    backgroundColor: color.gris
  }
});