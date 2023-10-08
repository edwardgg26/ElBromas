import { Text, View, TouchableOpacity, LayoutAnimation, ScrollView, Image, Platform } from 'react-native'
import React from 'react'
import GlobalStyles from "../GlobalStyles";
import firebase from 'firebase/compat/app';
import Header from '../components/Header';
import TabMenu from '../components/TabMenu';
import * as ImagePicker from "expo-image-picker";

  // const addProfilePhoto = async () => {
  //   // const {status} = getPermission();

  //   // if(status !== "granted"){
  //   //   alert("Status: ",status);

  //   //   return;
  //   // }

  //   pickImage();
  // }


export default class EditarFotoPerfil extends React.Component {

  state = {
    image: ""
  }

  seleccionarImagen = async() => {

    // ImagePicker.openPicker(
    //   {
    //     cropping: true,
    //     forceJpg: true,
    //     maxFiles:1,
    //     height:2000,
    //     width:2000
    //   }
    // ).then(image => {
    //   console.log(image);
    //   const imageUri = Platform.OS === 'android' ? image.sourceURL: image.path;
    //   this.setState({image:imageUri});
    // })

    try {
      let result = ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 0.5
      });
      if (!(await result).canceled) {
        this.setState({image: (await result).assets[0].uri});
        console.log(this.state.image);
      }

    } catch (error) {
      console.log("Error @pickImage: ",error);
    }
  }

  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Editar Foto de Perfil</Text>

          <TouchableOpacity
            onPress={this.seleccionarImagen}
          >
            <Text style={GlobalStyles.botonGris}>Selecciona una Imagen</Text>
          </TouchableOpacity>

          {this.state.image && <Image source={{uri:this.state.image}}></Image>}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Text style={GlobalStyles.botonAzul}>Subir</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Profile")} style={GlobalStyles.alinearIzquierda}>
            <Text style={GlobalStyles.botonSubrayado}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=>console.log(this.state.image)} style={GlobalStyles.alinearIzquierda}>
            <Text style={GlobalStyles.botonSubrayado}>Probar imagen</Text>
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