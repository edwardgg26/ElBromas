import { Text, StyleSheet, View } from 'react-native'
import React from 'react';
import GlobalStyles from '../GlobalStyles';

export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.contenedorHeader}>
        <Text style={GlobalStyles.titulo}>ElBromas</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    contenedorHeader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: "#ffffff",
        maxHeight: 70
    }
})