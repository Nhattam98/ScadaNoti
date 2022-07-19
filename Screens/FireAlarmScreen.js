import React, { useEffect, useMemo, useState } from "react";
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
} from "native-base";
import { RefreshControl, SafeAreaView } from "react-native";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import Loader from './Reload';
import { Avatar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDataFireAlarm from '../components/api/api';
import { DeleteFireAlarm } from "../components/api/api";
import moment from "moment";


export default function HomeScreen({ route, navigation }) {
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
    const email = await AsyncStorage.getItem('@email');
    const token = await AsyncStorage.getItem('@token');
    setisLoading(true);
    var V_P_SEND = "Send2";
    var time = moment(new Date()).format("HHmmss");
    if (time <= '120000') {
      V_P_SEND = 'Send1';
    }
    if (time >= '130000') {
      V_P_SEND = 'Send2';
    }
    if (email != null && token != null) {
      return await getDataFireAlarm(V_P_SEND, email, token).then((response) => {
        setdata(response)
        setisLoading(false);
      }).catch((error) => {
        setisLoading(false);
        console.log("Không tìm thấy dữ liệu: " + error);
      });
    }
  }
  async function deleteData(V_P_EMAIL, V_P_ORD) {
    setisLoading(true);
    return await DeleteFireAlarm(V_P_EMAIL, V_P_ORD).then((response) => {
      setdata(response);
      fetchFireAlarmData();
      setisLoading(false);
    }).catch((error) => {
      setisLoading(false);
      console.log("Không tìm thấy dữ liệu: " + error);
    });
  }
  const _onRefresh = () => {
    fetchFireAlarmData();
  };
  useEffect(() => {
    setisLoading(true);
    try {
      const unsubscribe = navigation.addListener("focus", () => {
        fetchFireAlarmData();
      });
      return unsubscribe;
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

            <HStack space={1} alignItems="center" justifyContent="space-between" >
              <Avatar.Text size={50} backgroundColor="#F984AB" label={this.props.item.LINE_NM} />
              <VStack>
                <Text
                  fontSize={18}
                  _dark={{
                    color: "blue.500",
                  }}
                  color="blue.500"
                  bold
                > {this.props.item.MC_NM}
                </Text>
                <Divider />
                <VStack>
                  <Text
                    fontSize={15}
                    _dark={{
                      color: "red.500",
                    }}
                    color="red.500" bold> - {this.props.item.MC_CD} [{this.props.item.MC_ID}]
                  </Text>
                  <Text
                    fontSize={15}
                    _dark={{
                      color: "green.600",
                    }}
                    color="green.600" bold> - Plant {this.props.item.PLANT} - {this.props.item.OP_NM}
                  </Text>
                  <Text
                    fontSize={16}
                    color="purple.500"
                    _dark={{
                      color: "purple.500",
                    }}
                    bold
                  > - PV: {this.props.item.PV_VALUE}, Min: {this.props.item.MIN_VALUE},  Max: {this.props.item.MAX_VALUE}
                  </Text>
                  <Text
                    fontSize={15}
                    color="warning.400"
                    _dark={{
                      color: "warning.800",
                    }}
                    bold
                  > - Time: {this.props.item.HMS}
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
    ), [data]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  async function deleteRow(rowMap, rowKey) {
    closeRow(rowMap, rowKey);
    const email = await AsyncStorage.getItem('@email');
    if (email != null) {
      deleteData(email, rowKey);
    }
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened is: ', rowKey);
  };
  const renderHiddenItem = (data, rowMap) => <HStack flex={0.94}>
    <Pressable px={4} ml="auto" bg="dark.500" borderRadius={9} justifyContent="center" onPress={() => closeRow(rowMap, data.item.ORD)} _pressed={{
      opacity: 0.5
    }}>
      <Icon as={<Ionicons name="close" />} color="white" />
    </Pressable>
    <Pressable px={4} bg="red.500" borderRadius={9} justifyContent="center" onPress={() => deleteRow(rowMap, data.item.ORD)} _pressed={{
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
            initialNumToRender={10}
            keyExtractor={(item, index) => item.ORD}
          />
          <Loader isLoading={isLoading} />
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

