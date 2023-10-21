import { Text, View, TouchableOpacity, ScrollView, StyleSheet} from "react-native";
import React from "react";

import FontStyle from "../style/FontStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";

import { auth } from "../config/firebase";
import CategorieViewModel from "../viewmodel/CategorieViewModel";

export default class CategorieScreen extends React.Component {
  state = {
    categorias: [],
    errorMessage: null
  };

  async componentDidMount() {
    const categorias = await CategorieViewModel.obtener()
    .catch(error => this.setState({errorMessage: verificarError(error.code)}));
    if(this.state.errorMessage === null){
      this.setState({ categorias })
    }
  }

  async componentDidUpdate(prevProps,prevState){
    if(this.state !== prevState){
      const categorias = await CategorieViewModel.obtener()
      .catch(error => this.setState({errorMessage: verificarError(error.code)}));
      if(this.state.errorMessage === null){
        this.setState({ categorias })
      }
    }
  }

  render() {

    const { categorias } = this.state;

    return (
      <View style={ContainerStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={ContainerStyles.contenidoPantalla}>
          <Text style={[FontStyle.subtitulo, UtilidadesStyle.marginVertical10, UtilidadesStyle.marginTop20]}>Categorias</Text>

          {categorias.map((dato) => (
            <TouchableOpacity key={dato.id} style={UtilidadesStyle.marginVertical10}
            onPress={() => this.props.navigation.navigate("Home",{id: dato.id})}
            >
              <Text style={[FontStyle.parrafo,styles.categoria]}>{dato.tipo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TabMenu
          home={() => this.props.navigation.navigate("Home",{id: -2})}
          subirMeme={() => this.props.navigation.navigate("Subir")}
          categories={() => this.props.navigation.navigate("Categories")}
          profile={() => this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid})}
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
