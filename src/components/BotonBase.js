import { Text, ActivityIndicator,  TouchableOpacity } from "react-native";
import React, { Component } from "react";

import { color } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";
import FormularioStyle from "../style/FormularioStyle";

export default class BotonBase extends Component {

  state = {
    estilos: [],
    colorTexto: null,
    texto: "",
    loading: false
  }

  componentDidMount(){
    const { tipo , texto } = this.props;
    let estilos = [];
    let colorTexto = null 

    //Asignar estilos y color del texto dependiendo del tipo de boton
    if(tipo === "azul"){
      estilos = [FormularioStyle.botonBase, FormularioStyle.botonAzul, UtilidadesStyle.marginVertical10];
      colorTexto = color.blanco;
    } else if(tipo === "subra"){
      estilos = [FormularioStyle.botonBase, FormularioStyle.botonSubrayado, UtilidadesStyle.marginVertical10, UtilidadesStyle.alinearIzquierda];
      colorTexto = color.azul;
    } else if(tipo === "gris"){
      estilos = [FormularioStyle.botonBase, FormularioStyle.botonGris, UtilidadesStyle.marginVertical10];
      colorTexto = color.negro;
    } else if(tipo === "negro"){
      estilos = [FormularioStyle.botonBase, FormularioStyle.botonNegro, UtilidadesStyle.marginVertical10];
      colorTexto = color.blanco;
    }

    this.setState({estilos , colorTexto , texto});
  }

  ejecFunc = async() => {
    const { funcion } = this.props;

    //Establecer estado para cargar y ejecutar la funcion del boton
    this.setState({loading: true});
    await funcion();
    this.setState({loading: false});
  }

  render() {
    
    const { texto , loadButton } = this.props;
    
    return (
      <TouchableOpacity  onPress={this.ejecFunc} >
        
        {/* En caso de que sea un boton de carga y se este ejecutando la funcion
            Se muestra el indicador. De lo contrario se muestra el texto */}

        {loadButton === true && this.state.loading === true ? (
          <ActivityIndicator
            style={[this.state.estilos]}
            color={this.state.colorTexto}
            size="small"
          ></ActivityIndicator>
        ) : (
          <Text style={this.state.estilos}>{texto}</Text>
        )}
      </TouchableOpacity>
    );
  }
}