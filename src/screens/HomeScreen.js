import { Text, View, TouchableOpacity,ScrollView,  LayoutAnimation } from "react-native";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import Meme from "../components/Meme";
import firebase from "firebase/compat";

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Subir Meme</Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Subir")}
          >
            <Text style={GlobalStyles.botonAzul}>Subir Meme</Text>
          </TouchableOpacity>

          <Text style={GlobalStyles.subtitulo}>Memes Publicados</Text>

          <Meme />
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
