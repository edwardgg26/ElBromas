import { Text, View, TouchableOpacity, ScrollView, Image , StyleSheet } from 'react-native'
import React from 'react'

import ContainerStyles from '../style/ContainerStyles';
import FontStyle from '../style/FontStyle';
import FormularioStyle from '../style/FormularioStyle';
import UtilidadesStyle from '../style/UtilidadesStyle';
import { color } from '../style/VariablesStyle';

import Header from '../components/Header';
import TabMenu from '../components/TabMenu';
import BotonBase from '../components/BotonBase';

import { seleccionarImagen, verificarError } from '../config/funciones';
import { auth } from '../config/firebase';
import UserViewModel from '../viewmodel/UserViewModel';

export default class EditarFotoPerfil extends React.Component {

  state = {
    image: "",
    loading: false,
    errorMessage: null
  }

  addProfilePhoto = async() => {
    this.setState({loading: true});
    if(this.state.image){
      const respuesta = await UserViewModel.editarFotoDePerfil(auth.currentUser.uid, this.state.image);
      if(respuesta === "completado"){
        this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid});
      }else{
        this.setState({errorMessage: verificarError(respuesta),loading:false});
      }
    }else{
      this.setState({errorMessage: verificarError("no-image-selected"),loading:false});
    }
  }

  pickImage = async() => {
    let result = await seleccionarImagen("perfil");
    if (result !== "no-permission" && !result.canceled) {
      this.setState({image: result.assets[0].uri, errorMessage: null});
    }
  }

  render() {
    return (
      <View style={ContainerStyles.contenedorPantalla}>
        <Header/>

        <ScrollView contentContainerStyle={[ContainerStyles.contenidoPantalla]}
                    style={ContainerStyles.contenidoPantalla}>

          <Text style={[FontStyle.subtitulo,
                        UtilidadesStyle.marginVertical10,
                        UtilidadesStyle.marginTop20]}>Editar Foto de Perfil</Text>

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

          {/* Seccion de botones */}
          <BotonBase tipo="azul" funcion={this.addProfilePhoto} texto="Subir" loadButton={true}/>
          <BotonBase tipo="gris" funcion={()=>this.props.navigation.navigate("Profile",{uid: auth.currentUser.uid})} texto="Cancelar" loadButton={false}/>
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