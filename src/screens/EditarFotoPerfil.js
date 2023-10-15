import { Text, View, TouchableOpacity, ScrollView, Image , StyleSheet} from 'react-native'
import React from 'react'
import * as ImagePicker from "expo-image-picker";

import ContainerStyles from '../style/ContainerStyles';
import FontStyle from '../style/FontStyle';
import FormularioStyle from '../style/FormularioStyle';
import UtilidadesStyle from '../style/UtilidadesStyle';
import { color } from '../style/VariablesStyle';

import Header from '../components/Header';
import TabMenu from '../components/TabMenu';

import { auth, storage, db } from '../config/firebase';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

export default class EditarFotoPerfil extends React.Component {

  state = {
    image: "",
    errorMessage: null
  }

  addProfilePhoto = async() => {
    if(this.state.image){

      const response = await fetch(this.state.image);
      const blob = await response.blob();

      const idUser = auth.currentUser.uid;
      const reference =  ref(storage,`profilePhoto/${idUser}`);

      await uploadBytes(reference, blob).then(() => {
        getDownloadURL(reference).then(url => {
          const batch = db.batch();
          const referenciaUsuario = db.collection("users").doc(idUser);
          const referenciaMemes = db.collection("memes").where("user.uid","==",idUser);
          batch.update(referenciaUsuario,{
            photoURL: url
          })
          referenciaMemes.get().then(async querySnapshot => {
            querySnapshot.forEach((doc)=>{
              var postRef = db.collection("memes").doc(doc.id);
              batch.update(postRef, {"user.photoURL": url});
            })
            await batch.commit()
            .then(result => this.props.navigation.navigate("Home"))
            .catch(error => console.log(error));
          }).catch(error => console.log(error))
        })
      }).catch(error => {
        console.log(error.message);
      });
    }
  }

  pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.5
    });
    if (!result.canceled) {
      this.setState({image: result.assets[0].uri});
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

          <View>
            {this.state.errorMessage && (
              <Text style={FormularioStyle.error}>{this.state.errorMessage}</Text>
            )}
          </View>

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

          <TouchableOpacity
            onPress={this.addProfilePhoto}
          >
            <Text style={[FormularioStyle.botonBase, 
                          FormularioStyle.botonAzul,
                          UtilidadesStyle.marginVertical10]}>Subir</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Profile")}>
            <Text style={[FormularioStyle.botonBase, FormularioStyle.botonGris]}>Cancelar</Text>
          </TouchableOpacity>
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
  imagenPerfil: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow:'hidden',
    backgroundColor: color.gris
  }
});