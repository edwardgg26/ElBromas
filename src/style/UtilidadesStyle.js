import { StyleSheet } from "react-native";
import { color } from "./VariablesStyle";

export default StyleSheet.create({
  //Utilidades para estilos muy puntuales

  //Colores y fuente
  colorRed: {
    color: color.rojo
  },
  backgroundGris: {
    backgroundColor: color.gris
  },
  fontWeightBold: {
    fontWeight: "bold"
  },

  //Box model
  marginLeft10:{
    marginLeft: 10
  },
  marginVertical10: {
    marginVertical: 10
  },
  marginTop20: {
    marginTop: 20
  },
  marginBottom20: {
    marginBottom: 20
  },
  paddingVertical15: {
    paddingVertical: 15 
  },
  alinearIzquierda: {
    alignSelf: "flex-start",
  },
  alinearCenter: {
    alignSelf: "center",
  },
  alinearDerecha: {
    alignSelf: "flex-end",
  },
  width80Perc: {
    width: "80%",
    alignSelf: "center"
  },
  width60Perc: {
    width: "60%",
    alignSelf: "center"
  },
  width50Perc: {
    width: "50%"
  },
  borderBottomBlack: {
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});
