import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons , MaterialIcons } from "@expo/vector-icons";

import { color, iconSize } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import { auth } from "../config/firebase";

import { obtenerUsuario } from "../modules/UserModule";

export default class TabMenu extends React.Component {
  
  state = {
    notiReaded: true
  }

  componentDidMount(){
    this.cargarEstadoUsuario();
  }

  componentDidUpdate(prevProps,prevState){
    if(this.state.notiReaded !== prevState.notiReaded || this.props !== prevProps){
      this.cargarEstadoUsuario();
    }
  }

  cargarEstadoUsuario = async() =>{
    //Cargar el usuario por medio del id de este dado por props
    const infoUsuario = await obtenerUsuario(auth.currentUser.uid)
    .catch(error => this.setState({errorMessage: verificarError(error)}));
    this.setState({notiReaded: infoUsuario.notiReaded});
  }

  render(){
    const {parentProps} = this.props;

    return (
      <View style={styles.tabContainer}>
        {/* Navegar al inicio */}
        <TouchableOpacity
          onPress={() => parentProps.navigation.navigate("Home",{id: -2})}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="home" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>

        {/* Navegar a Subir meme */}
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
          {this.state.notiReaded!==null && this.state.notiReaded === false?(
            <MaterialIcons style={UtilidadesStyle.paddingVertical15} name="notification-important" size={iconSize.medium} color={color.negro} />
          ):(
            <MaterialIcons style={UtilidadesStyle.paddingVertical15} name="notifications" size={iconSize.medium} color={color.negro} />
          )}
        </TouchableOpacity>

        {/* Navegar al Perfil propio */}
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