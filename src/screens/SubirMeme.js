import { Text, View, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native'
import React from 'react'
import GlobalStyles from "../GlobalStyles";
import firebase from 'firebase/compat/app';
import Header from '../components/Header';
import TabMenu from '../components/TabMenu';

export default class SubirMeme extends React.Component {
  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Subir Meme</Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={GlobalStyles.botonGris}>Selecciona una Imagen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={GlobalStyles.botonGris}>Selecciona una Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={GlobalStyles.botonAzul}>Subir Meme</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home")} style={GlobalStyles.alinearIzquierda}>
            <Text style={GlobalStyles.botonSubrayado}>Cancelar</Text>
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