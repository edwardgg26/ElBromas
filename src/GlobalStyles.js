import { StyleSheet } from "react-native";

export default StyleSheet.create({
  //Contenedores
  contenedorPantalla: {
    flex: 1,
    paddingTop: 40,
    position: "relative"
  },
  contenidoPantalla:{ 
    padding: "10%",
    paddingVertical: 30
  },
  contenedorHorizontalPegado: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  contenedorHorizontalSeparado: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
  ,
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
  },
  //Fuentes
  titulo: {
    fontWeight: "bold",
    fontSize: 32,
  },
  subtitulo: {
    fontWeight: "bold",
    fontSize: 24,
  },
  letraRoja: {
    color: "#C54D42"
  },
  //Formularios
  error: {
    minWidth: "100%",
    backgroundColor: "#BD3124",
    color: "white",
    padding: 10,
    textAlign: "center",
    marginTop: "5%",
  },
  form: {
    marginVertical: "5%",
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    minWidth: "100%",
    padding: 5,
    marginBottom: "5%",
  },
  botonAzul: {
    minWidth: "100%",
    backgroundColor: "#0F40F5",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  botonGris: {
    minWidth: "100%",
    backgroundColor: "#CEDBDE",
    color: "black",
    padding: 10,
    textAlign: "center",
  },
  botonSubrayado: {
    padding: 10,
    paddingLeft: 0,
    textAlign: "left",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: "#0F40F5",
  }
});
