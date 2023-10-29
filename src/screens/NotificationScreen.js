import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image
  } from "react-native";
  import React from "react";
  
  import FontStyle from "../style/FontStyle";
  import UtilidadesStyle from "../style/UtilidadesStyle";
  import ContainerStyles from "../style/ContainerStyles";
  
  import TabMenu from "../components/TabMenu";
  import Header from "../components/Header";

  import { obtenerNotis } from "../modules/NotificationModule";
  import { editarEstadoNoti } from "../modules/UserModule";
  import { auth } from "../config/firebase";
  
  export default class NotificationScreen extends React.Component {
    state = {
      errorMessage: false,
      notificaciones: []
    };
  
    async componentDidMount(){
      const respuesta = await editarEstadoNoti({user:{uid:auth.currentUser.uid}},true);
      if(respuesta !== "completado"){
        errorCodigo = respuesta;
      }
      this.cargarNotis();
    }

    async componentDidUpdate(prevProps,prevState){
        if(this.state.notificaciones !== prevState.notificaciones){
            this.cargarNotis();
        }
    }

    cargarNotis = async () => {
        //Cargar los memes por medio del id del usuario dado por props
        const notificaciones = await obtenerNotis(auth.currentUser.uid)
        .catch(error => this.setState({errorMessage: verificarError(error)}));
        this.setState({ notificaciones });
    }

    render() {
  
      const { notificaciones } = this.state;
      
      return (
  
        <View style={ContainerStyles.contenedorPantalla}>
          <Header />
          
          <ScrollView style={ContainerStyles.contenidoPantalla}>

            {notificaciones.length !== 0 && notificaciones.map((dato) => (
                
                <TouchableOpacity key={dato.id} onPress={()=>this.props.navigation.navigate("Profile",{uid: dato.usuarioLike.uid})}
                                style={[ContainerStyles.contenedorHorizontal,
                                        UtilidadesStyle.paddingVertical15,
                                        UtilidadesStyle.borderBottomBlack]}>

                    <Image style={{height: 50, width: 50}} source={{uri: dato.memeURL}} resizeMode="contain"/>

                    <Text textBreakStrategy="balanced" style={[FontStyle.parrafo, UtilidadesStyle.marginLeft10]}>
                        <Text style={UtilidadesStyle.fontWeightBold}>{dato.usuarioLike.username} </Text>
                        ha reaccionado a uno {"\n"}de tus memes.
                    </Text>
                
                </TouchableOpacity>
                
            ))}
          </ScrollView>
          
          <TabMenu parentProps={this.props}/>
        </View>
      );
    }
  }