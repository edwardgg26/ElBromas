import { StyleSheet } from "react-native";

export default StyleSheet.create({
  //Contenedores
  contenedorPantalla: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 60,
    position: "relative"
  },
  contenidoPantalla:{ 
    paddingHorizontal: "5%"
  },
  contenedorHorizontal:{
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  contenedorHorizontalPegado: {
    justifyContent: "center"
  },
  contenedorHorizontalSeparado: {
    justifyContent: "space-between"
  },
  contenedorCentrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  alinearIzquierda: {
    alignSelf: "flex-start",
  },
  alinearCentro: {
    alignSelf: "center"
  },
  anchoNormal: {
    width: "auto"
  }
});
