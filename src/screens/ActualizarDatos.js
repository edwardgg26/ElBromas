import {
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import firebase from "firebase/compat/app";
import Header from "../components/Header";
import TabMenu from "../components/TabMenu";

export default class ActualizarDatos extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: "",
    errorMessage: null,
    loading: false,
  };
  render() {
    return (
      <View style={GlobalStyles.contenedorPantalla}>
        <Header />

        <ScrollView style={GlobalStyles.contenidoPantalla}>
          <Text style={GlobalStyles.subtitulo}>Actualizar Datos</Text>

          <View>
            <Text>Nombre de Usuario</Text>
            <TextInput
              placeholder="Ingresa tu apodo unico..."
              style={GlobalStyles.input}
              onChangeText={(username) => this.setState({ username })}
              value={this.props.username}
              autoCapitalize="none"
            ></TextInput>
          </View>
          <View>
            <Text>Email</Text>
            <TextInput
              placeholder="Ingresa tu email..."
              style={GlobalStyles.input}
              onChangeText={(email) => this.setState({ email })}
              value={this.props.email}
              keyboardType="email-address"
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View>
            <Text>Contraseña</Text>
            <TextInput
              placeholder="Ingresa tu contraseña..."
              style={GlobalStyles.input}
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={this.props.password}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <View>
            <Text>Confirmar Contraseña</Text>
            <TextInput
              placeholder="Confirma tu contraseña..."
              style={GlobalStyles.input}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              value={this.props.confirmPassword}
              autoCapitalize="none"
            ></TextInput>
          </View>

          <TouchableOpacity /*onPress={this.handleSingUp}*/>
            {this.state.loading ? (
              <ActivityIndicator
                style={GlobalStyles.botonAzul}
                color="#ffffff"
                size="small"
              ></ActivityIndicator>
            ) : (
              <Text style={GlobalStyles.botonAzul}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Profile")}
            style={GlobalStyles.alinearIzquierda}
          >
            <Text style={GlobalStyles.botonSubrayado}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>

        <TabMenu
          home={() => this.props.navigation.navigate("Home")}
          categories={() => this.props.navigation.navigate("Categories")}
          profile={() => this.props.navigation.navigate("Profile")}
        />
      </View>
    );
  }
}
