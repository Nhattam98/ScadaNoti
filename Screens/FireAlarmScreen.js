import * as React from 'react';
import {
  Text,
  Box,
  FlatList,
  HStack,
  VStack,
  Spacer,
  Divider,
  Center,
  Pressable,
  Icon,
  NativeBaseProvider,
  StatusBar
} from "native-base";

export default function FireAlarmScreen() {
  const AppBar = () => {
    return (
      <>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Box safeArea />
        <HStack px="5" py="3">
          <Text color="tertiary.600" fontSize="18" fontWeight="bold">Fire Alarm Systems</Text>
        </HStack>
      </>
    );
  }
  return (
    <NativeBaseProvider>
      <AppBar />
    </NativeBaseProvider>
  );
}
