import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SimpleLineIcons } from '@expo/vector-icons'; 

import FontStyle from "../style/FontStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import ContainerStyles from "../style/ContainerStyles";
import { color, iconSize } from "../style/VariablesStyle";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import Meme from "../components/Meme";

import { auth , db } from "../config/firebase";

export default class HomeScreen extends React.Component {

  state = {
    memes: [],
    reload: false
  }

  componentDidMount() {
    this.cargarMemes();
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.reload === true && this.state !== prevState){
      this.cargarMemes();
      this.setState({reload: false});

    }
  }

  recargarMemes = async() => {
    this.setState({reload: true});
  }

  cargarMemes = async () => {
    const referenciaMemes = db.collection("memes").orderBy("fecha","desc");

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

  render() {
    const { memes } = this.state;

    return (
      <View style={ContainerStyles.contenedorPantalla}>
      
        <Header/>

        <ScrollView style={ContainerStyles.contenidoPantalla}>

          <View style={[ContainerStyles.contenedorHorizontal,
                        ContainerStyles.contenedorHorizontalSeparado, 
                        UtilidadesStyle.marginTop20]}>

            <Text style={[FontStyle.subtitulo]}>Memes Recientes</Text>
          
            <TouchableOpacity onPress={this.recargarMemes}>
              <SimpleLineIcons name="reload" size={iconSize.medium} color={color.negro} />
            </TouchableOpacity>
          </View>
          
          {memes.length !== 0 && memes.map((dato) => (
            <Meme memePerfil = {false} key={dato.id} visitaUsuario = {()=>this.props.navigation.navigate("Profile",{uid: dato.user.uid})} datos={dato} />
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
