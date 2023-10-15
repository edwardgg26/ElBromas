import { StyleSheet } from "react-native";
import { fuente } from "./VariablesStyle";

export default StyleSheet.create({
  //Componente para Fuentes
  titulo: {
    fontWeight: "bold",
    fontSize: fuente.large,
  },
  subtitulo: {
    fontWeight: "bold",
    fontSize: fuente.medium,
  },
  parrafo: {
    fontSize: fuente.small,
  }
});
