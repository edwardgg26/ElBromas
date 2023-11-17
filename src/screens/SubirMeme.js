//Importar Expo React Native y librerias
import { Text, View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { MaterialIcons } from '@expo/vector-icons';

//Importar Estilos
import FontStyle from '../style/FontStyle';
import FormularioStyle from '../style/FormularioStyle';
import ContainerStyles from '../style/ContainerStyles';
import UtilidadesStyle from '../style/UtilidadesStyle';
import { color } from '../style/VariablesStyle';

//Importar Componentes
import Header from '../components/Header';
import TabMenu from '../components/TabMenu';
import BotonBase from '../components/BotonBase';

//Importar modulos y configs
import { auth  } from '../config/firebase';
import { seleccionarImagen , verificarError} from '../config/funciones';
import { obtenerCategorias } from "../modules/CategorieModule";
import { subirMeme } from '../modules/UserMemeModule';

//Exporta componente de la pantalla de subir meme para que pueda ser utilizado en el stack
export default class SubirMeme extends React.Component {

  //image guarda la ruta de la imagén seleccionada en la galeria
  //errorMessage guarda un error en caso de haberlo, para mostrarlo en pantalla
  //selectedCategories guarda el id de las categorias seleccionadas para el meme
  //categorias guarda todas las categorias
  state = {
    image: "",
    errorMessage: null,
    selectedCategories: [],
    categorias: []
  }

  //Funcion que se ejecuta cuando se inicia el componente
  async componentDidMount(){
    //Ejecuta la funcion obtenerCategorias del modulo de categories para obtener todas las categorias
    const categorias = await obtenerCategorias()
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    this.setState({ categorias });
  }
  
  //Funcion que se ejecuta cuando se pulsa el boton subir meme
  uploadMeme = async() => {

    //En caso de que se haya seleccionado una imagen ejecuta lo siguiente, de lo contrario muestra un error
    if(this.state.image){

      //En caso de que se haya seleccionado una o mas categorias ejecuta lo siguiente, de lo contrario muestra un error
      if(this.state.selectedCategories.length !== 0){

        //Ejecuta la funcion "subirMeme" del modulo de UserMeme
        //Se le pasa el id del usuario que inicio sesion ya que es el que esta subiendo el meme
        //Se le pasa la ruta de la imagen seleccionada
        //Se le pasa las categorias seleccionadas
        const respuesta = await subirMeme(auth.currentUser.uid, this.state.image, this.state.selectedCategories);
        
        //Si retorna "completado" lleva a la pantalla Home con todos los memes
        //De lo contrario muestra el error
        if(respuesta === "completado"){
          this.props.navigation.navigate("Home",{id: -2});
        }else{
          this.setState({errorMessage: verificarError(respuesta)});
        }
      }else{
        this.setState({errorMessage: verificarError({code: "no-category-selected"})});
      }
    }else{
      this.setState({errorMessage: verificarError({code: "no-image-selected"})});
    }
  }

  //Funcion que se ejecuta cuando se pulsa el boton "seleccionar imagen"
  pickImage = async() => {

    //Ejecuta la funcion "seleccionarImagen" de las funciones, se le pasa "meme" para el tipo de imagen
    let result = await seleccionarImagen("meme");
    
    //Se establece la ruta de la imagen en el estado, una vez se haya seleccionado 
    if (result !== "no-permission" && !result.canceled) {
      this.setState({image: result.assets[0].uri, errorMessage: null});
    }
  }

  //Funcion que muestra TODO lo que se ve en pantalla
  render(){
    return (
      <View style={ContainerStyles.contenedorPantalla}>
        
        {/* Se muestra lo que hay en el header por medio del componente Header */}
        <Header/>
       
        {/* ScrollView se usa para crear una seccion desplazable de arriba a abajo */}
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
          
          {/* Mostrar lista de categorias, por medio de una libreria llamada SectionedMultiSelect */}
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

        {/* Se muestra lo que hay en el menu de navegacion por medio del componente TabMenu */}
        <TabMenu parentProps={this.props}/>
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