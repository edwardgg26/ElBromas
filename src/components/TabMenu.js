import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { color, iconSize } from "../style/VariablesStyle";
import UtilidadesStyle from "../style/UtilidadesStyle";

export default class TabMenu extends React.Component {
  
  render(){
    const {home,categories,profile,subirMeme} = this.props;

    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={home}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="home" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={subirMeme}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="add-circle" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={categories}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="list" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={profile}
        >
          <Ionicons style={UtilidadesStyle.paddingVertical15} name="person" size={iconSize.medium} color={color.negro} />
        </TouchableOpacity>
      </View>
    );
  }
  
};

const styles = StyleSheet.create({
  tabContainer: {
      flex: 1,
      flexDirection: "row",
      position: "absolute",
      bottom: 0,
      width: "100%",
      borderTopWidth: StyleSheet.hairlineWidth,
      backgroundColor: "#ffffff",
      justifyContent: "space-around"
  }
})