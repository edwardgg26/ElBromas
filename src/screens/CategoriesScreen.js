import { Text, View, TouchableOpacity, ScrollView, StyleSheet} from "react-native";
import React from "react";

import FontStyle from "../style/FontStyle";
import ContainerStyles from "../style/ContainerStyles";
import UtilidadesStyle from "../style/UtilidadesStyle";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";

import { db , auth } from "../config/firebase";

export default class CategorieScreen extends React.Component {
  state = {
    categorias: []
  };
  componentDidMount() {
    this.cargarCategorias();
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state !== prevState){
      this.cargarCategorias();
    }
  }

  cargarCategorias = async () => {
    const referenciaUsuario = db.collection("categorias");

    referenciaUsuario.get()
      .then((querySnapshot) => {
        const datosArray = [];
        querySnapshot.forEach((doc) => {
          datosArray.push({ id: doc.id, ...doc.data() });
        });
        
        this.setState({categorias: datosArray});
      })
      .catch((error) => {
        console.error('Error al obtener datos: ', error);
      });
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
  categoria: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});
