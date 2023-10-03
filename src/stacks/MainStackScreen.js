import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import SubirMeme from "../screens/SubirMeme";

export default MainStackScreens = () => {
    const MainStack = createBottomTabNavigator();

    const tabBarOptions = {
        
    }

    const screenOptions = (({route}) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
            height: 60
        },

        tabBarIcon: ({focused}) => {
            let iconName = "ios-home";

            switch (route.name){
                case "Home":
                    iconName = "ios-home";
                    break;
                case "Categories":
                    iconName = "list";
                    break;
                case "Profile":
                    iconName = "person";
                    break;
                default:
                    iconName = "ios-home";

            }

            return <Ionicons name={iconName} size={24} color={focused ? "#000000" : "#666666"}/>;
        }
    }))
    
    return (
        <MainStack.Navigator screenOptions={screenOptions}>
            <MainStack.Screen name="Home" component={HomeScreen}/>
            <MainStack.Screen name="Categories" component={CategoriesScreen}/>
            <MainStack.Screen name="Profile" component={ProfileScreen}/>
        </MainStack.Navigator>
    )
}