import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Box, HStack, Text, StatusBar } from 'native-base';
//Import Screens
import LoginScreen from './Screens/LoginScreen';
import MainScreen from './Screens/MainScreen';
import LoadingScreen from './Screens/LoadingScreen';
//firebase
import firebase from 'firebase/compat/app';
import apiKeys from './database/key';

const Stack = createNativeStackNavigator();

const AppBar = () => {
  return (
    <>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <Box safeAreaTop />
      <HStack px="5" py="3">
        <Text color="tertiary.600" fontSize="18" fontWeight="bold">Scada Notification Resource</Text>
      </HStack>
    </>
  );
}

export default function App() {
  if (!firebase.apps.length) {
    console.log('Connected with Firebase')
    firebase.initializeApp(apiKeys.firebaseConfig, { useFeatchStream: false });
  }
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AppBar/>
        <Stack.Navigator>
          <Stack.Screen name="Loading" component={LoadingScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}


