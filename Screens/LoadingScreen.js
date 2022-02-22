import React, { useEffect} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import firebase from "firebase/compat/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoadingScreen({ navigation }) {
    useEffect(() => {
        AsyncStorage.getItem("@email").then((user_data_json) => {
            let user = user_data_json;
            console.log("User:--->", user);
            if (user) {
                navigation.replace("Main", { email: user})
            } else {
                firebase.auth().onAuthStateChanged((user) => {
                    console.log("user--ok------>", user);
                    if (user) {
                        navigation.replace("Main", { email: user})
                    } else {
                        navigation.replace("Login");
                    }
                });
            }
        });
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        //backgroundColor: '#3FC5AB',
        alignItems: "center",
        justifyContent: "center",
    },
});