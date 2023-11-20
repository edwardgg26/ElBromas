//Importar Librerias React-Native
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import React from "react";
import { SimpleLineIcons , Ionicons } from "@expo/vector-icons";

//Importar Estilos
import FontStyle from "../style/FontStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import { color, iconSize } from "../style/VariablesStyle";
import ContainerStyles from "../style/ContainerStyles";

//Importar Componentes
import TabMenu from "../components/TabMenu";
import Header from "../components/Header";
import Meme from "../components/Meme";

//Importar modulos y configs
import { verificarError } from "../config/funciones";
import { auth } from "../config/firebase";
import { obtenerPorUsuario } from "../modules/MemeModule";
import { obtenerUsuario , cerrarSesion } from "../modules/UserModule";

//Exporta componente de la pantalla del perfil del usuario para que pueda ser utilizado en el stack
export default class ProfileScreen extends React.Component {

  //infoUsuario guarda la infomacion del usuario que se carga
  //errorMessage guarda un error en caso de haberlo, para mostrarlo en pantalla
  //memes es un arreglo que guarda todos los memes
  state = {
    infoUsuario: null,
    errorMessage: false,
    memes: []
  };

  //Funcion que se ejecuta cuando se inicia el componente
  async componentDidMount() {
    
    //Recibe por props un id de usuario
    //Si la prop viene del navegador, es el id del usuario que inicio sesión
    //Si la prop viene de un meme, es el id del usuario que publico el meme
    const {uid} = this.props.route.params;

    this.cargarUsuario(uid);
  }

  //Funcion que se ejecuta cuando se actualiza el estado de los memes o las props
  componentDidUpdate(prevProps,prevState){
    const {uid} = this.props.route.params;

    if(this.props !== prevProps){
      console.log("Actualizando perfil")
      this.cargarUsuario(uid);
    }
  }

  //Funcion que se encarga de cargar el usuario
  cargarUsuario = async(uid) => {
    //Ejecuta la funcion obtenerUsuario del modulo de users, por medio del id de este dado por props
    const infoUsuario = await obtenerUsuario(uid)
    .catch(error => this.setState({errorMessage: verificarError(error)}));

    //Ejecuta la funcion obtenerPorUsuario del modulo de memes, por medio del id del usuario dado por props
    const memes = await obtenerPorUsuario(uid)
    .catch(error => this.setState({errorMessage: verificarError(error)}));

    //Se guarda la informacion en los estados meme e infoUsuario
    this.setState({ infoUsuario , memes });
  }

  //Funcion que se encarga de recargar el usuario
  recargarUsuario = async() => {

    //Recibe por props un id de usuario
    //Si la prop viene del navegador, es el id del usuario que inicio sesión
    //Si la prop viene de un meme, es el id del usuario que publico el meme
    const {uid} = this.props.route.params;
    this.cargarUsuario(uid);
  }

  //Funcion que se encarga de cerrar sesión
  singOutUser = async() => {
    //Ejecuta la funcion cerrarSesion del modulo de users
    const respuesta = await cerrarSesion();

    //Si retorna "completado" cierra sesión y lleva a la pantalla de login
    //De lo contrario muestra el error en pantalla
    if(respuesta !== "completado"){
      this.setState({errorMessage: verificarError(respuesta)});
    }
  };

  //Funcion que muestra TODO lo que se ve en pantalla
  render() {
    const { infoUsuario , memes } = this.state;
    const {uid} = this.props.route.params;

    return (

      <View style={ContainerStyles.contenedorPantalla}>
        
        {/* Se muestra lo que hay en el header por medio del componente Header */}
        <Header />
        
        {/* ScrollView se usa para crear una seccion desplazable de arriba a abajo */}
        <ScrollView style={ContainerStyles.contenidoPantalla}>
          <View style={UtilidadesStyle.width60Perc}>

            {/* 
              Foto de perfil del usuario 
              En caso de que el usuario no tenga una URL de foto de perfil, se muestra la "foto de no perfil" guarda en el directorio "img"
              En caso de que el usuario tenga una URL de foto de perfil, se carga la foto subida a internet
            */}
            {(infoUsuario === null || infoUsuario.photoURL === "")?(
              <Image style={styles.imagenPerfil} source={require("../img/no-profile-image.png")}></Image>
            ):(
              <Image style={styles.imagenPerfil} source={{ uri: infoUsuario.photoURL }}></Image>
            )}

            {/* 
              Boton para Editar foto de perfil
              Se muestra si el id de las props es igual al id del usuario que inicio sesión
            */}
            {(auth.currentUser.uid === uid)?(
              <TouchableOpacity onPress={() => this.props.navigation.navigate("EditarFoto")}>
                <Ionicons name="pencil" style={[UtilidadesStyle.alinearDerecha, UtilidadesStyle.marginVertical10]} size={iconSize.medium} color={color.azul} />
              </TouchableOpacity>
            ):null}
          </View>
          
          {/* Mostrar Nombre de usuario */}
          <Text style={[FontStyle.subtitulo, 
                        UtilidadesStyle.alinearCenter, 
                        UtilidadesStyle.marginVertical10]}>
            {infoUsuario !== null && (
              infoUsuario.username
            )}
          </Text>

          {/* Mostrar Informacion del usuario */}
          <View>
            <Text style={[FontStyle.subtitulo, 
                          UtilidadesStyle.alinearCenter, 
                          UtilidadesStyle.marginVertical10]}>
              Información del Usuario
            </Text>

            {/* Mostrar email del usuario */}
            <View style={UtilidadesStyle.marginVertical10}>

              <Text style={[FontStyle.parrafo,UtilidadesStyle.marginVertical10]}>Correo: {infoUsuario !== null && (infoUsuario.email)}</Text>
            </View>

            <View style={[ContainerStyles.contenedorHorizontal, 
                         ContainerStyles.contenedorHorizontalSeparado]}>

              {/* Mostrar username */}
              <Text style={[FontStyle.parrafo,
                            UtilidadesStyle.marginVertical10, 
                            UtilidadesStyle.alinearIzquierda]}>Username: {infoUsuario !== null && (infoUsuario.username)}</Text>

              {/* 
                Boton para Editar info del usuario
                Se muestra si el id de las props es igual al id del usuario que inicio sesión
              */}
              {(auth.currentUser.uid === uid)?(
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Actualizar")}
                >
                  <Ionicons name="pencil" style={UtilidadesStyle.alinearDerecha} size={iconSize.medium} color={color.azul} />
                </TouchableOpacity>
              ):null}
            </View>

            {/* 
              Boton para cerrar sesion 
              Se muestra si el id de las props es igual al id del usuario que inicio sesión
            */}
            {(auth.currentUser.uid === uid)?(
              <TouchableOpacity onPress={this.singOutUser}>
                <Text style={[FontStyle.parrafo, 
                              UtilidadesStyle.colorRed, 
                              UtilidadesStyle.marginVertical10]}>Cerrar Sesión</Text>
              </TouchableOpacity>


            ):null}
            
          </View>
          
          {/* Mostrar memes del usuario */}
          {memes.length !== 0 && (  

            <View style={[ContainerStyles.contenedorHorizontal , ContainerStyles.contenedorHorizontalSeparado]}>
              <Text style={[FontStyle.subtitulo, 
                            UtilidadesStyle.alinearIzquierda,
                            UtilidadesStyle.marginVertical10]}>
                Memes Publicados
              </Text>

              {/* Boton para recargar la info del usuario */}
              <TouchableOpacity onPress={this.recargarUsuario}>
                <SimpleLineIcons name="reload" size={iconSize.medium} color={color.negro} />
              </TouchableOpacity>
            </View>
          
          )}
          
          {/* Se recorre el arreglo de memes, para cada meme se crea un componente Meme 
              y por props se pasa la informacion del meme */}
          {memes.length !== 0 && memes.map((dato) => (
              <Meme key={dato.id} memePerfil = {true} visitaUsuario = {()=>this.props.navigation.navigate("Profile",{uid: dato.user.uid})} datos={dato} />
          ))}
          
        </ScrollView>
        
        {/* Se muestra lo que hay en el menu de navegacion por medio del componente TabMenu */}
        <TabMenu parentProps={this.props}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagenPerfil: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginTop: 35,
    backgroundColor: color.gris
  },
  imagenMeme: {
    width: "100%",
    backgroundColor: "#000000",
  },
  username: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
