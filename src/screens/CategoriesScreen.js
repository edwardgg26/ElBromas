import { Text, View, TouchableOpacity, LayoutAnimation, ScrollView, StyleSheet} from "react-native";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import firebase from "firebase/compat";

export default class CategorieScreen extends React.Component {
  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Categorias</Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={styles.categoria}>Categoria 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={styles.categoria}>Categoria 2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={styles.categoria}>Categoria 3</Text>
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

const styles = StyleSheet.create({
  categoria: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});
