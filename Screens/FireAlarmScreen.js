import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Text,
  Box,
  HStack,
  VStack,
  Spacer,
  Divider,
  Center,
  Pressable,
  Icon,
  NativeBaseProvider,
  StatusBar,
  Toast,
  View,
} from "native-base";
import { RefreshControl, VirtualizedList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import Loader from './Reload';
import * as Notifications from "expo-notifications";
import { Avatar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import  getDataFireAlarm from '../components/api/api';
import moment from "moment";


export default function HomeScreen({ navigation }) {
  const [data, setdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(false);

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

  async function fetchFireAlarmData() {
    setisLoading(true);
    var V_P_SEND = "";
    var time = moment(new Date()).format("HHmmss");
    console.log(moment(new Date()).format("HHmmss"));
    if (time <= '120000') {
      V_P_SEND = 'Send1';
    }
    if (time >= '130000' && time <= '163000') {
      V_P_SEND = 'Send2';
    }
    console.log(V_P_SEND);
   return await getDataFireAlarm(V_P_SEND).then((response) => {
    console.log(response);
      setdata(response)
      setisLoading(false);
    }).catch((error) => {
      setisLoading(false);
      console.log("Không tìm thấy dữ liệu: " + error);
    });
  }
  const deleteData_Test = (doc_id) => {
    firebase.firestore().collection("FireAlarmCollection").doc(doc_id).delete().then(function () {
      loadData();
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }
  // const loadData = async () => {
  //   const db = firebase.firestore();
  //   try {
  //     setisLoading(true);
  //     AsyncStorage.getItem('@email').then((user_data_json) => {
  //       const data = [];
  //       let user =
  //         firebase.auth().currentUser?.email == null
  //           ? user_data_json
  //           : firebase.auth().currentUser?.email;
  //       db.collection("FireAlarmCollection").where("SHOW_YN", "==", "Y").where("User_Email", "==", user).orderBy("DeptCode", "asc")
  //         .onSnapshot((querySnapshot) => {
  //           querySnapshot.forEach((documentSnapshot) => {
  //             data.push({
  //               ...documentSnapshot.data(),
  //               key: documentSnapshot.id,
  //             });

  //           });
  //           setdata(data);
  //         });
  //       // Unsubscribe from events when no longer in use
  //       return () => {
  //         setdata([]);
  //       };
  //     });
  //   } catch { }
  //   setisLoading(false);
  // }
  const _onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };
  useEffect(async () => {
    setisLoading(true);
    try {
      fetchFireAlarmData();
    } catch (error) {
      Toast(error);
    } finally {
      setisLoading(false); // set loading to false
    }
  }, [navigation]);

  class RenderItem extends React.PureComponent {
    render() {
      return (
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
          pl="5"
          pr="5"
          py="2"
          mb={2}
        >
          <Pressable onPress={() => console.log('You touched me')} borderBottomColor="trueGray.200" borderBottomWidth={1} justifyContent="center" underlayColor={'#AAA'} _pressed={{
            bg: 'trueGray.200'
          }}>

            <HStack space={2} alignItems="center" justifyContent="space-between" >
              <Avatar.Text size={50} backgroundColor="#F984AB" label={this.props.item.User_Avatar} />
              <VStack>
                <Text
                  fontSize={18}
                  _dark={{
                    color: "blue.500",
                  }}
                  color="blue.500"
                  bold
                > {this.props.item.McName}
                </Text>
                <Divider />
                <VStack>
                  <Text
                    fontSize={15}
                    _dark={{
                      color: "red.500",
                    }}

                    color="red.500" bold> - {this.props.item.McCode} [{this.props.item.McId}]

                  </Text>
                  <Text
                    fontSize={15}
                    _dark={{
                      color: "green.600",
                    }}
                    color="green.600" bold> - Plant {this.props.item.Plant} - {this.props.item.OpName}
                  </Text>
                  <Text
                    fontSize={16}
                    color="purple.500"
                    _dark={{
                      color: "purple.500",
                    }}
                    bold
                  > - PV: {this.props.item.PvValue}, Min: {this.props.item.MinValue},  Max: {this.props.item.MaxValue}
                  </Text>
                  <Text
                    fontSize={15}
                    color="warning.400"
                    _dark={{
                      color: "warning.800",
                    }}
                    bold
                  >- Time: {this.props.item.Hms}
                  </Text>
                </VStack>
              </VStack>
              <Spacer />
            </HStack>
          </Pressable>
        </Box>
      )
    }
  }
  const _renderItem = useMemo(() =>

    ({ item }) => (
      <RenderItem item={item} />
    ),
    [data]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey, index) => {
    closeRow(rowMap, index);
    const newData = [...data];
    const prevIndex = data.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    deleteData_Test(rowKey);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened is: ', rowKey);
  };
  const renderHiddenItem = (data, rowMap) => <HStack flex={0.94}>
    <Pressable px={4} ml="auto" bg="dark.500" borderRadius={9} justifyContent="center" onPress={() => closeRow(rowMap, data.index)} _pressed={{
      opacity: 0.5
    }}>
      <Icon as={<Ionicons name="close" />} color="white" />
    </Pressable>
    <Pressable px={4} bg="red.500" borderRadius={9} justifyContent="center" onPress={() => deleteRow(rowMap, data.item.key, data.index)} _pressed={{
      opacity: 0.5
    }}>
      <Icon as={<MaterialIcons name="delete" />} color="white" />
    </Pressable>
  </HStack>;

  return (
    <NativeBaseProvider>
      <AppBar />
      <Center py={1} px={3} pb={100} backgroundColor="gray.200">
        <Box
          w={{ base: "100%", }}
          h={{ base: "100%", }}
        // safeArea
        >

          <SwipeListView removeClippedSubviews={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={_onRefresh}
                tintColor="#0284c7" />
            }
            data={data}
            renderItem={_renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-130}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={onRowDidOpen}
            initialNumToRender={7}
            keyExtractor={(item, index) => index}
          />
          <Loader isLoading={isLoading} />
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

