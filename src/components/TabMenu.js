import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import GlobalStyles from "../GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

export default class TabMenu extends React.Component {
  
  render(){
    const {home,categories,profile} = this.props;
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={home}
        >
          <Ionicons style={styles.tabItem} name="home" size={24} color="black" />
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={categories}
        >
          <Ionicons style={styles.tabItem} name="list" size={24} color="black" />
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={profile}
        >
          <Ionicons style={styles.tabItem} name="person" size={24} color="black" />
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
      backgroundColor: "#ffffff"
  },
  tabItem: {
    paddingHorizontal: 53,
    paddingVertical: 15
  }
})