import { Text, StyleSheet, View, Image } from "react-native";
import React, { Component } from "react";
import GlobalStyles from "../GlobalStyles";
import { AntDesign } from "@expo/vector-icons";

export default class Meme extends Component {
  render() {
    const { perfilUsuario, feedMemes } = this.props;

    return (
      <View>
        {!perfilUsuario ? (
          <View style={GlobalStyles.contenedorHorizontalPegado}>
            <Image
              style={styles.imagenPerfil}
              source={require("../img/no-profile-image.png")}
            ></Image>
            <Text style={styles.username}>Username</Text>
          </View>
        ) : null}

        <Image
          style={styles.imagenMeme}
          source={require("../img/meme-prueba.jpg")}
        ></Image>

        <View style={GlobalStyles.contenedorHorizontalSeparado}>
          <View style={GlobalStyles.contenedorHorizontalPegado}>
            <AntDesign name="smileo" size={24} color="black" />
            <Text>26</Text>
          </View>

          {perfilUsuario ? (
            <AntDesign name="delete" size={24} color="#C54D42" />
          ) : null}

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
