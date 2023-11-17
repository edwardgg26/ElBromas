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

import { obtenerMemes, obtenerPorCategoria } from "../modules/MemeModule";
import { obtenerPorId } from "../modules/CategorieModule";

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
    //Se obtienen las props pasadas por el navegador
    const params = this.props.route.params;

    if(!params || params.id === -2){
      //En caso de no haber props o que el id pasado por props sea -2 se obtienen todos los memes 
      const memes = await obtenerMemes();
    
      if(memes){
        this.setState({ memes, categoria: null });
      }
      // else{
      //   this.setState({ errorMessage: verificarError(memes) });
      // }
    }else{
      //De lo contrario se obtiene la categoria 
      const categoria = await obtenerPorId(params.id);
      
      if(categoria){
        this.setState({ categoria })
      }
      // else{
      //   this.setState({ errorMessage: verificarError(categoria) });
      // }
      
      //Posteriormente se obtienen los memes con la categoria pasada por props
      const memes = await obtenerPorCategoria(params.id);
      if(memes){
        this.setState({ memes });
      }
      // else{
      //   this.setState({ errorMessage: verificarError(memes) });
      // }

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

          {memes.length !== 0 ? memes.map((dato) => (
            <Meme memePerfil = {false} key={dato.id} visitaUsuario={()=>this.props.navigation.navigate("Profile",{uid: dato.user.uid})} datos={dato} />
          )):null}
        </ScrollView>

        <TabMenu parentProps={this.props}/>
      </View>
    );
  }
}
