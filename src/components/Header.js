import { Text, StyleSheet, View } from 'react-native'
import React from 'react';
import FontStyle from '../style/FontStyle';

export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.contenedorHeader}>
        <Text style={FontStyle.titulo}>ElBromas</Text>
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
        height: 80,
        position: 'absolute',
        top: 0,
        width: "100%",
        zIndex: 100,
        paddingTop: 10
    }
})