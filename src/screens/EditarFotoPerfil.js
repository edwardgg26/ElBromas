import { Text, View, TouchableOpacity, LayoutAnimation, ScrollView } from 'react-native'
import React from 'react'
import GlobalStyles from "../GlobalStyles";
import firebase from 'firebase/compat/app';
import Header from '../components/Header';
import TabMenu from '../components/TabMenu';

export default class EditarFotoPerfil extends React.Component {
  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header/>

        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Editar Foto de Perfil</Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Text style={GlobalStyles.botonGris}>Selecciona una Imagen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
          >
            <Text style={GlobalStyles.botonAzul}>Subir</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Profile")} style={GlobalStyles.alinearIzquierda}>
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