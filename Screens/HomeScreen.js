import React, { useEffect, useMemo, useState } from "react";
import {
    Text,
    Box,
    FlatList,
    HStack,
    VStack,
    Spacer,
    Divider,
    Center,
} from "native-base";
import { RefreshControl } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import Loader from './Reload';
import * as Notifications from "expo-notifications";
import { Avatar } from "react-native-paper";

export default function HomeScreen({ navigation }) {
    const [data, setdata] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    let data_app_store = [
        {
            "DateTime": "2022/02/21",
            "DeptCode": "003",
            "DeptName": "2",
            "Hms": "2022-02-21 1:10:00 PM",
            "MaxValue": "53",
            "McCode": "HCS_KD_12_0009",
            "McName": "Heating Chamber",
            "MinValue": "47",
            "ORD": "1871",
            "OpCode": "FSS",
            "OpName": "Stockfit",
            "Plant": "2-3",
            "PvValue": "38",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "2",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "CzMGl5rZOcVg4JoenVFc",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "016",
            "DeptName": "J",
            "Hms": "2022-02-21 1:26:00 PM",
            "MaxValue": "93",
            "McCode": "HBP_KD_BCM2H_0009",
            "McName": "Hot Mold BP 2 Head",
            "MinValue": "87",
            "ORD": "1882",
            "OpCode": "FGA",
            "OpName": "Assembly",
            "Plant": "J-1",
            "PvValue": "32,767",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "J",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "CGglmjY5xh9gMYbUGks2",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "016",
            "DeptName": "J",
            "Hms": "2022-02-21 1:41:00 PM",
            "MaxValue": "58",
            "McCode": "HCS_KD_1_0021",
            "McName": "Heating Chamber",
            "MinValue": "52",
            "ORD": "1919",
            "OpCode": "FSS",
            "OpName": "Stockfit",
            "Plant": "J-2",
            "PvValue": "35",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "J",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "ZBHj6TD0ZWoJJV4FyRQW",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "099",
            "DeptName": "N",
            "Hms": "2022-02-21 1:42:00 PM",
            "MaxValue": "58",
            "McCode": "AHC_USMC_RDS5_2_0008",
            "McName": "Heating Chamber",
            "MinValue": "52",
            "ORD": "1940",
            "OpCode": "FGA",
            "OpName": "Assembly",
            "Plant": "N-2",
            "PvValue": "47",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "N",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "CFcRQn71DX8EkT1N0c4K",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "015",
            "DeptName": "I",
            "Hms": "2022-02-21 1:51:00 PM",
            "MaxValue": "93",
            "McCode": "HBP_KD_BCM2H_ST_0027",
            "McName": "Hot Mold BP 2 Head",
            "MinValue": "87",
            "ORD": "1957",
            "OpCode": "FGA",
            "OpName": "Assembly",
            "Plant": "I-4",
            "PvValue": "190",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "I",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "2WIIVBZiuAziQlYel1IF",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "015",
            "DeptName": "I",
            "Hms": "2022-02-21 1:51:00 PM",
            "MaxValue": "93",
            "McCode": "HBP_KD_BCM2H_ST_0027",
            "McName": "Hot Mold BP 2 Head",
            "MinValue": "87",
            "ORD": "1958",
            "OpCode": "FGA",
            "OpName": "Assembly",
            "Plant": "I-4",
            "PvValue": "190",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "I",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "r8kdZ1k1UvouRyZIAULX",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "007",
            "DeptName": "B",
            "Hms": "2022-02-21 1:58:00 PM",
            "MaxValue": "4",
            "McCode": "STE_HEAM_1_C_0016",
            "McName": "Steamer Conveyor",
            "MinValue": "-2",
            "ORD": "1999",
            "OpCode": "FGA",
            "OpName": "Assembly",
            "Plant": "B-2",
            "PvValue": "131",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "B",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "hBgvnHRV6C1lZrZxaEZ7",
        },
        {
            "DateTime": "2022/02/21",
            "DeptCode": "099",
            "DeptName": "N",
            "Hms": "2022-02-21 2:02:00 PM",
            "MaxValue": "53",
            "McCode": "STE_HEAM_1_C_0009",
            "McName": "Steamer Conveyor",
            "MinValue": "47",
            "ORD": "2009",
            "OpCode": "FGA",
            "OpName": "Assembly",
            "Plant": "N-2",
            "PvValue": "4",
            "SHOW_YN": "Y",
            "SendYN": "N",
            "User_Avatar": "N",
            "User_Email": "test133@gmail.com",
            "User_Token": "ExponentPushToken[5U22gSGW1HEcr_kdYu7nGT]",
            "key": "AOlVN5OzMqRc6idsRlED",
        },
    ];
    const loadData = async () => {
        const db = firebase.firestore();
        setisLoading(true);
        try {
            AsyncStorage.getItem('@email').then((user_data_json) => {
                const data = [];
                let user =
                    firebase.auth().currentUser?.email == null
                        ? user_data_json
                        : firebase.auth().currentUser?.email;
                console.log("User Login: ", user);
                db.collection("ScadaCollection").where("SHOW_YN", "==", "Y").where("User_Email", "==", user).orderBy("ORD", "asc")
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((documentSnapshot) => {
                            data.push({
                                ...documentSnapshot.data(),
                                key: documentSnapshot.id,
                            });

                        });
                        setdata(data);
                    });
                // Unsubscribe from events when no longer in use
                return () => {
                    setdata([]);
                };
            });
        } catch { }
        setisLoading(false);
    }
    const _onRefresh = () => {
        console.log("_onRefresh");
        setRefreshing(true);
        //loadData();
        setdata(data_app_store);
        setRefreshing(false);
    };
    useEffect(async () => {
        const unsubscribe = navigation.addListener("focus", () => {
            Notifications.setBadgeCountAsync(0);
            //loadData();
            setdata(data_app_store);

        });
        return unsubscribe;
    }, [navigation]);
    const _renderItem = useMemo(() =>
        ({ item }) => (
            <Box
                borderRadius={9}
                borderBottomWidth={1}
                borderLeftWidth={1}
                borderRightWidth={1}
                _dark={{
                    borderColor: "gray.600",
                }}
                backgroundColor="white"
                borderColor="coolGray.200"
                pl="4"
                pr="5"
                py="2"
                mb={2}
            >
                <HStack space={3} alignItems="center" justifyContent="space-between">
                    {/* <Avatar
                        size="50px"
                        borderColor="yellow.400"
                        borderWidth="2"
                        source={{ uri: item.User_Avatar }}
                    /> */}
                    <Avatar.Text size={50} backgroundColor="#3686d1" label={ item.User_Avatar} />

                    <VStack>
                        <Text
                            fontSize="18"
                            _dark={{
                                color: "warmGray.50",
                            }}
                            color="coolGray.800"
                            bold
                        > {item.Plant} ({item.DateTime})
                        </Text>
                        <Divider/>
                        <VStack space={1}>
                        <Text
                            _dark={{
                                color: "red.50",
                            }}

                            color="red.800" bold> - {item.McName}

                        </Text>
                        <Text
                            _dark={{
                                color: "red.50",
                            }}
                            color="green.700" bold> - {item.OpName}
                        </Text>
                            <Text
                                color="purple.800"
                                _dark={{
                                    color: "purple.800",
                                }}
                                bold
                            > - PV: {item.PvValue}
                            </Text>
                            <Text
                                color="info.600"
                                _dark={{
                                    color: "info.600",
                                }}
                                bold
                            > - Max: {item.MaxValue}
                            </Text>
                            <Text
                                color="teal.400"
                                _dark={{
                                    color: "teal.400",
                                }}
                                bold
                            > - Min: {item.MinValue}
                            </Text>
                            <Text
                                color="warning.400"
                                _dark={{
                                    color: "warning.800",
                                }}
                                bold
                            > - Time: {item.Hms}
                            </Text>
                        </VStack>
                        </VStack>
                    <Spacer />
                </HStack>
            </Box>
        ),
        [data]);
    return (
        <Center py={1} px={3} backgroundColor="gray.200">
            <Box
                w={{ base: "100%", }}
                h={{ base: "100%", }}
            >
                <FlatList removeClippedSubviews={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={_onRefresh}
                            tintColor="#0284c7" />
                    }
                    data={data}
                    renderItem={_renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Loader isLoading={isLoading} />
            </Box>
        </Center>
    );
}