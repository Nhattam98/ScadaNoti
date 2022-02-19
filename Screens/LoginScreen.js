import { Button, KeyboardAvoidingView, FormControl, Input, Icon, Box, VStack, NativeBaseProvider, Heading, useToast } from 'native-base';
import { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "firebase/compat/firestore";


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [isValid, setisvalidate] = useState(false);
    const Toast = useToast();

    //Delete Value in Item
    async function removeValue() {
        try {
            await AsyncStorage.removeItem('@email')
        } catch (e) {
            console.log(e);
        }
    }
    //Check Email Valid
    function checkValid(text) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            setEmail(text);
            setisvalidate(false);
            return false;
        } else {
            setEmail(text);
            setisvalidate(true);
        }
    }
    //Get Data from AsyncStorage
    async function getData() {
        try {
            const value = await AsyncStorage.getItem('@email')
            if (value !== null) {
                setEmail(value);
                setisvalidate(true);
                navigation.navigate("Main", { email: value })
            }
        } catch (error) {
            console.log(error);
        }
    }
    function HandleOnLogin(email) {
        console.log("Log in Clicked!!!");
        try {
            if (isValid) {
                navigation.navigate("Main", { email: email });
                Toast.show({
                    bg: "green.800",
                    title: "Welcome to " + email,
                });
            } else {
                Toast.show({
                    title: "email is not correct,check again!!",
                    status: "error",
                    description: "Please input your work email",
                    placement: "top",
                });
            }
        } catch (error) {
            alert("Please enter your email address");
            console.log(error);
        }
    }
    useEffect(async () => {
        const unsubscribe = await navigation.addListener("focus", () => {
            removeValue();
            console.log("remove storage");
        });
        getData();
        return unsubscribe;
    }, []);
    return (
        <NativeBaseProvider>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                style={{ flex: 1, backgroundColor: '#ffffff' }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Box safeArea flex={1} p="2" py="10" w="90%" mx="auto">
                        <VStack space={3} p="2">
                            <Heading
                                size="lg"
                                fontWeight="600"
                                color="coolGray.800"
                                _dark={{
                                    color: "warmGray.50",
                                }}
                            >
                                Welcome
                            </Heading>
                            <Heading
                                mt="1"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                                color="red.600"
                                fontWeight="medium"
                                size="xs"
                            >
                                Sign in to continue!
                            </Heading>
                            {/* Form Input View */}
                            <FormControl>
                                <FormControl.Label
                                    _text={{
                                        color: "coolGray.800",
                                        fontSize: "xs",
                                        fontWeight: 500,
                                    }}
                                >
                                    E-Mail
                                </FormControl.Label>
                                <Input
                                    InputLeftElement={
                                        <Icon
                                            as={<MaterialIcons name="email" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />}
                                    placeholder="Email address"
                                    value={email}
                                    onChangeText={(text) => checkValid(text)}
                                />
                            </FormControl>
                            <Button
                                endIcon={<Icon as={Ionicons} name="enter-outline" size="sm" />}
                                w="100%"
                                mt="2"
                                colorScheme="indigo"
                                _text={{ color: "white" }}
                                onPress={() => HandleOnLogin(email)}
                            >
                                Sign In
                            </Button>
                        </VStack>
                    </Box>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    );
}
