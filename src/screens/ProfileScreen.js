import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import React, { Component } from "react";
import GlobalStyles from "../GlobalStyles";
import * as ImagePicker from "expo-image-picker";
import TabMenu from "../components/TabMenu";
import firebase from "firebase/compat";
import Header from "../components/Header";
import Meme from "../components/Meme";
import { Ionicons } from '@expo/vector-icons'; 

export default class ProfileScreen extends React.Component {
  state = {
    email: "",
    displayName: "",
  };

  // const getPermission = async () =>{
  //   if(Platform.OS !== "web"){
  //     const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  //     return status;
  //   }
  // }

  // const pickImage = async () => {
  //   try {
  //     let result = ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [1,1],
  //       quality: 0.5
  //     });

  //     if(!result.cancelled){
  //       setProfilePhoto(result.uri);
  //     }
  //   } catch (error) {
  //     console.log("Error @pickImage: ",error);
  //   }
  // }

  // const addProfilePhoto = async () => {
  //   // const {status} = getPermission();

  //   // if(status !== "granted"){
  //   //   alert("Status: ",status);

  //   //   return;
  //   // }

  //   pickImage();
  // }

  componentDidMount(){
    const {email,displayName} = firebase.auth().currentUser;

    this.setState({email,displayName});
  }

  singOutUser = () => {
    firebase.auth().signOut();
  };

  render() {
    LayoutAnimation.easeInEaseOut();
    return (

      <View style={GlobalStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={GlobalStyles.contenidoPantalla}>

          <Image style={styles.imagenPerfil} source={require("../img/no-profile-image.png")}></Image>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("EditarFoto")}
          >
            <Ionicons name="pencil" size={24} color="#0F40F5" />
          </TouchableOpacity>

          
          <Text style={[GlobalStyles.subtitulo, GlobalStyles.alinearCentro]}>{this.state.email}</Text>

          <View>
            <Text style={[GlobalStyles.subtitulo, GlobalStyles.alinearCentro]}>Información del Usuario</Text>

            <View tyle={GlobalStyles.contenedorHorizontalSeparado}>
              <Text>Username: {this.state.displayName}</Text>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Actualizar")}
              >
                <Ionicons name="pencil" size={24} color="#0F40F5" />
              </TouchableOpacity>
            </View>

            <View tyle={GlobalStyles.contenedorHorizontalSeparado}>
              <Text>Correo: {this.state.email}</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Actualizar")}
              >
                <Ionicons name="pencil" size={24} color="#0F40F5" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={this.singOutUser}>
              <Text style={GlobalStyles.letraRoja}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[GlobalStyles.subtitulo, GlobalStyles.alinearCentro]}>Memes Publicados</Text>

            <Meme perfilUsuario={true} feedMemes={false} />
            <Meme perfilUsuario={true} feedMemes={false} />
            <Meme perfilUsuario={true} feedMemes={false} />
          </View>
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

const styles = StyleSheet.create({
  imagenPerfil: {
      width:200,
      height: 200,
      borderRadius: 600,
      alignSelf: "center"
  },
  imagenMeme:{
      width: "100%",
      backgroundColor: "#000000"
  },
  username: {
      fontWeight: "bold",
      fontSize: 20
  }
})