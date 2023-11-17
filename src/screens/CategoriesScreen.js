import { Text, View, TouchableOpacity, ScrollView} from "react-native";
import React from "react";

import FontStyle from "../style/FontStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";

import { obtenerCategorias } from "../modules/CategorieModule";

export default class CategorieScreen extends React.Component {
  state = {
    categorias: [],
    errorMessage: null
  };

  async componentDidMount() {
    const categorias = await obtenerCategorias()
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    if(this.state.errorMessage === null){
      this.setState({ categorias })
    }
  }

  async componentDidUpdate(prevProps,prevState){
    if(this.state !== prevState){
      const categorias = await obtenerCategorias()
      .catch(error => this.setState({errorMessage: verificarError(error)}));
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
            <TouchableOpacity key={dato.id}
            onPress={() => this.props.navigation.navigate("Home",{id: dato.id})}
            >
              <Text style={[FontStyle.parrafo,UtilidadesStyle.borderBottomBlack, UtilidadesStyle.paddingVertical15]}>{dato.tipo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TabMenu parentProps={this.props}/>
      </View>
    );
  }
}
