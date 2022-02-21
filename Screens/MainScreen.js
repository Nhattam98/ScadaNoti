import { NativeBaseProvider } from 'native-base';
import React, { useState, useRef, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from './HomeScreen';
import InformationScreen from '../Screens/InformationScreen';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Tab = createBottomTabNavigator();
export default function MainScreen({ route, navigation }) {
    const { email } = route.params;
    console.log(route.params);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const db  = firebase.firestore();
    // async function SaveTokenUser(email, token) {
    //     await db
    //         .collection("Tokens")
    //         .doc(email + "|" + token)
    //         .set(
    //             {
    //                 email: email,
    //                 token: token,
    //                 last_login: new Date().toLocaleString(),
    //             },
    //             { merge: true }
    //         )
    //         .then(function () {
    //             setExpoPushToken(token);
    //             storeTokenData(token);
    //             console.log("Cấp token thành công!");
    //         });
    // }
    async function SaveTokenUser(email, token) {
        await db
            .collection("Tokens")
            .doc(email)
            .set(
                {
                    email: email, 
                    last_login: new Date().toLocaleString(),
                },
                { merge: true }
            )
            .then(function () {
                setExpoPushToken(token);
                storeTokenData(token);
                console.log("Cấp token thành công!");
            });
    }
    async function storeData(value) {
        try {
            await AsyncStorage.setItem("@email", value);
        } catch (e) {
            // saving error
            console.log(e);
        }
    }

    async function storeTokenData(value) { 
        try {
            await AsyncStorage.setItem("@token", value);
        } catch (e) {
            // saving error
            //console.log(e);
        }
    }
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => SaveTokenUser(email, token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        console.log(email);
        storeData(email); //Luu tru email lai cho lan sau khoi dang nhap
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <NativeBaseProvider>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Home") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "Settings") {
                            iconName = focused ? "information-circle-outline" : "information-circle-outline";
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                })}
            >
                <Tab.Screen name="Home"
                    options={{ title: "Home", headerShown: false }}
                    component={HomeScreen}
                    initialParams={{ token: expoPushToken }}
                />
                {/* <Tab.Screen name="Settings" options={{ title: "Scada Information", headerShown: false }} component={InformationScreen} /> */}
            </Tab.Navigator>
        </NativeBaseProvider>
    );
}
async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    return token;
}