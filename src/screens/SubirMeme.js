import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons } from '@expo/vector-icons';

import FontStyle from '../style/FontStyle';
import FormularioStyle from '../style/FormularioStyle';
import ContainerStyles from '../style/ContainerStyles';
import UtilidadesStyle from '../style/UtilidadesStyle';
import { color } from '../style/VariablesStyle';

import Header from '../components/Header';
import TabMenu from '../components/TabMenu';
import BotonBase from '../components/BotonBase';

import { auth  } from '../config/firebase';
import { seleccionarImagen , verificarError} from '../config/funciones';
import CategorieViewModel from "../viewmodel/CategorieViewModel";
import MemeViewModel from '../viewmodel/MemeViewModel';

export default class SubirMeme extends React.Component {

  state = {
    image: "",
    errorMessage: null,
    selectedCategories: [],
    categorias: []
  }

  async componentDidMount(){
    //Cargar el usuario por medio del id de este dado por props
    const categorias = await CategorieViewModel.obtener()
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    this.setState({ categorias });
  }
  
  uploadMeme = async() => {
    if(this.state.image){
      if(this.state.selectedCategories.length !== 0){
        const respuesta = await MemeViewModel.subirMeme(auth.currentUser.uid, this.state.image, this.state.selectedCategories);
        if(respuesta === "completado"){
          this.props.navigation.navigate("Home",{id: -2});
        }else{
          this.setState({errorMessage: verificarError(respuesta)});
        }
      }else{
        this.setState({errorMessage: verificarError("no-category-selected")});
      }
    }else{
      this.setState({errorMessage: verificarError("no-image-selected")});
    }
  }

  pickImage = async() => {
    let result = await seleccionarImagen("meme");
    if (result !== "no-permission" && !result.canceled) {
      this.setState({image: result.assets[0].uri, errorMessage: null});
    }
  }

  render(){
    return (
      <View style={ContainerStyles.contenedorPantalla}>
        <Header/>
       
        <ScrollView style={ContainerStyles.contenidoPantalla}>
          <Text style={[FontStyle.subtitulo, 
                        UtilidadesStyle.marginVertical10, 
                        UtilidadesStyle.marginTop20]}>Subir Meme</Text>

          {/* Mensaje de error */}
          <View>
            {this.state.errorMessage && (
              <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>
            )}
          </View>

          {/* Seleccionar imagen */}
          <TouchableOpacity
            onPress={this.pickImage}
            style={[ContainerStyles.contenedorHorizontal,
                    UtilidadesStyle.marginVertical10]}
          >
            <View style={styles.imagenPerfil}>
              {this.state.image && <Image source={{ uri: this.state.image }} style={{ width: 48, height: 48 }} />}
            </View>

            <Text style={[FontStyle.parrafo,UtilidadesStyle.marginLeft10]}>Selecciona una Imagen</Text>
          </TouchableOpacity>
          
          {/* Mostrar lista de categorias */}
          <View>
            <SectionedMultiSelect
              items={this.state.categorias}
              uniqueKey="id"
              displayKey="tipo"
              searchPlaceholderText="Buscar categorias..."
              confirmText="Confirmar"
              showCancelButton={true}
              showRemoveAll={true}
              removeAllText='Eliminar Todo'
              colors={{cancel:color.rojo , primary:color.azul}}
              IconRenderer={MaterialIcons}
              selectText="Escoge una o mas categorias"
              onSelectedItemsChange={selectedCategories => this.setState({ selectedCategories, errorMessage: null })}
              selectedItems={this.state.selectedCategories}
            />
          </View>
        
          {/* Botones */}
          <BotonBase tipo="azul" funcion={this.uploadMeme} texto="Subir Meme" loadButton={true}/>
          <BotonBase tipo="gris" funcion={()=>this.props.navigation.navigate("Home",{id: -2})} texto="Cancelar" loadButton={false}/>
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
  imagenPerfil: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow:'hidden',
    backgroundColor: color.gris
  }
});