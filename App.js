import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider} from 'native-base';
//Import Screens
import LoginScreen from './Screens/LoginScreen';
import MainScreen from './Screens/MainScreen';
import LoadingScreen from './Screens/LoadingScreen';
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
        <Stack.Navigator>
          <Stack.Screen name="Loading" component={LoadingScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} /> 
          <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}


