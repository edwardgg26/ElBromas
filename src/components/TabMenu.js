//Importar Librerias React-Native
import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons , MaterialIcons } from "@expo/vector-icons";

//Importar Estilos
import { color, iconSize } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import { auth } from "../config/firebase";

//Importar modulos y configs
import { obtenerUsuario } from "../modules/UserModule";

//Exporta componente del menu de navegación para que pueda ser utilizado en las pantallas
export default class TabMenu extends React.Component {
  
  //notiReaded se encarga de guardar un campo del usuario, el cual indica ya leyo las notificaciones
  state = {
    notiReaded: true
  }

  //Funcion que se ejecuta cuando se inicia el componente
  componentDidMount(){
    this.cargarEstadoUsuario();
  }

  //Funcion que se ejecuta cuando se actualiza el estado notiReaded o las props
  componentDidUpdate(prevProps,prevState){
    if(this.state.notiReaded !== prevState.notiReaded || this.props !== prevProps){
      this.cargarEstadoUsuario();
    }
  }

  //Funcion que se encarga de cargar el estado del usuario usuario
  cargarEstadoUsuario = async() =>{
    //Cargar el usuario por medio del id de este dado por auth
    const infoUsuario = await obtenerUsuario(auth.currentUser.uid)
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    this.setState({notiReaded: infoUsuario.notiReaded});
  }

  //Funcion que muestra TODO lo que se ve en el componente
  render(){
    const {parentProps} = this.props;

    return (
      <View style={styles.tabContainer}>
        {/* 
          Boton Navegar al inicio, se pasa por props "id: -2"
          Esto debido a que cuando se pulsa Home se quieren ver todos los memes 
        */}
        <TouchableOpacity
          onPress={() => parentProps.navigation.navigate("Home",{id: -2})}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="home" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>

        {/* Boton Navegar a Subir meme */}
        <TouchableOpacity
          onPress={() => parentProps.navigation.navigate("Subir")}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="add-circle" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>
        
        {/* Navegar a Categorias */}
        <TouchableOpacity
          onPress={() => parentProps.navigation.navigate("Categories")}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="list" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>
  
        {/* Navegar a Notificaciones */}
        <TouchableOpacity
          onPress={()=>parentProps.navigation.navigate("Noti")}
        >
          {/* 
            Icono del boton, si el estado notiReaded es true, se muestra la campana normal
            De lo contrario se muestra la campana que indica notificaciones nuevas
          */}
          {this.state.notiReaded!==null && this.state.notiReaded === false?(
            <MaterialIcons style={UtilidadesStyle.paddingVertical15} name="notification-important" size={iconSize.medium} color={color.negro} />
          ):(
            <MaterialIcons style={UtilidadesStyle.paddingVertical15} name="notifications" size={iconSize.medium} color={color.negro} />
          )}
        </TouchableOpacity>

        {/* 
          Navegar al Perfil propio, se pasa por props "uid: id del usuario que inicio sesión"
          De esta forma cuando se vaya a esa pantalla se mostrara la info del usuario que inicio sesión
        */}
        <TouchableOpacity
          onPress={()=>parentProps.navigation.navigate("Profile",{uid: auth.currentUser.uid})}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="person" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>
      </View>
    );
  }
  
};

const styles = StyleSheet.create({
  tabContainer: {
      flex: 1,
      flexDirection: "row",
      position: "absolute",
      bottom: 0,
      width: "100%",
      borderTopWidth: StyleSheet.hairlineWidth,
      backgroundColor: "#ffffff",
      justifyContent: "space-around"
  }
})