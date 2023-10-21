import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SimpleLineIcons } from '@expo/vector-icons';

import FontStyle from "../style/FontStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import ContainerStyles from "../style/ContainerStyles";
import { color, iconSize } from "../style/VariablesStyle";
import FormularioStyle from "../style/FormularioStyle";

import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import Meme from "../components/Meme";
import { verificarError } from "../config/funciones";

import { auth } from "../config/firebase";
import MemeViewModel from "../viewmodel/MemeViewModel";
import CategorieViewModel from "../viewmodel/CategorieViewModel"

export default class HomeScreen extends React.Component {

  state = {
    memes: [],
    categoria: null,
    errorMessage: null
  }

  async componentDidMount() {
    this.cargarMemes();
  }

  async componentDidUpdate(prevProps) {

    if(this.props !== prevProps){
      this.cargarMemes();
    }
  }

  recargarMemes = async() => {
    this.cargarMemes();
  }

  cargarMemes = async() => {
    const params = this.props.navigation.state.params;
    if(!params || params.id === -2){
      const memes = await MemeViewModel.obtener()
      .catch(error => this.setState({errorMessage: verificarError(error)}));
      if(memes){
        this.setState({ memes, categoria: null });
      }
    }else{
      const categoria = await CategorieViewModel.obtenerPorId(params.id)
      .catch(error => this.setState({errorMessage: verificarError(error)}));
      if(categoria){
        this.setState({ categoria })
      }

      const memes = await MemeViewModel.obtenerPorCategoria(params.id)
      .catch(error => this.setState({errorMessage: verificarError(error)}));
      if(memes){
        this.setState({ memes })
      }

    }
  }


  render() {
    const { memes , categoria } = this.state;

    return (
      <View style={ContainerStyles.contenedorPantalla}>
      
        <Header/>

        <ScrollView style={ContainerStyles.contenidoPantalla}>

          <View style={[ContainerStyles.contenedorHorizontal,
                        ContainerStyles.contenedorHorizontalSeparado, 
                        UtilidadesStyle.marginTop20]}>

            <Text style={[FontStyle.subtitulo]}>{categoria === null ? "Memes Publicados" : categoria.tipo}</Text>
          
            <TouchableOpacity onPress={this.recargarMemes}>
              <SimpleLineIcons name="reload" size={iconSize.medium} color={color.negro} />
            </TouchableOpacity>
          </View>
          
          <View>
            {this.state.errorMessage && <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>}
          </View>

          {memes.length !== 0 && memes.map((dato) => (
            <Meme memePerfil = {false} key={dato.id} visitaUsuario={()=>this.props.navigation.navigate("Profile",{uid: dato.user.uid})} datos={dato} />
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
