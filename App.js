import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Box, HStack, Text } from 'native-base';
import { StatusBar } from "expo-status-bar";
//Import Screens
import LoginScreen from './Screens/LoginScreen';
import MainScreen from './Screens/MainScreen';
import InformationScreen from './Screens/InformationScreen';
//firebase
import firebase from 'firebase/compat/app';
import apiKeys from './database/key';

const Stack = createNativeStackNavigator();

export default function App() {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig, { useFeatchStream: false });
  }
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar/>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{title:"Scada Notification Resource", headerStyle:{backgroundColor: '#fff'}, headerTintColor: 'springgreen'}} />
          <Stack.Screen name="Main"  component={MainScreen}  options={({ route }) => ({title: "", headerBackTitle: "👋 "+ route.params.email })} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}


