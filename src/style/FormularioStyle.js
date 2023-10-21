import { StyleSheet } from "react-native";
import { color, fuente } from "./VariablesStyle";

export default StyleSheet.create({
  //Formularios

  //Alertas
  error: {
    minWidth: "100%",
    backgroundColor: color.rojo,
    color: color.blanco,
    padding: 10,
    textAlign: "center",
    // marginTop: "5%",
    fontSize: fuente.small
  },

  //Input
  inputContainer: {
    marginVertical: 10
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    minWidth: "100%",
    padding: 5,
    // marginBottom: "5%",
    fontSize: fuente.small,
    backgroundColor: color.blanco
  },

  //Botones
  botonBase: {
    minWidth: "100%",
    padding: 10,
    fontSize: fuente.small,
    textAlign: "center"
  },
  botonAzul: {
    backgroundColor: color.azul,
    color: color.blanco,
  },
  botonNegro: {
    backgroundColor: color.negro,
    color: color.blanco
  },
  botonGris: {
    backgroundColor: color.gris,
    color: color.negro
  },
  botonSubrayado: {
    paddingLeft: 0,
    textAlign: "left",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: color.azul
  }
});
