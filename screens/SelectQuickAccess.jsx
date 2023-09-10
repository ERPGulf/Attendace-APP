import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import Entypo from "@expo/vector-icons/Entypo";
import ButtonItem from "../components/SelectQuickAccess/ButtonItem";
import { useDispatch, useSelector } from "react-redux";
import {
  activeButtonsSelector,
  setAdd,
  setRemove,
} from "../redux/Slices/QuickAccessSlice";
const SelectQuickAccess = ({ navigation }) => {
  const activeButtons = useSelector(activeButtonsSelector);
  const dispatch = useDispatch();
  const quickAccessItems = [
    {
      id: 1,
      iconName: "calendar-outline",
      text1: "Attendance",
      text2: "action",
      url: "Attendance action",
    },
    {
      id: 2,
      iconName: "receipt-outline",
      text1: "Attendance",
      text2: "history",
      url: "Attendance history",
    },
    //ADD URL WHEN REST IS COMPLETE
    {
      id: 3,
      iconName: "airplane-outline",
      text1: "Vacation",
      text2: "request",
    },
    {
      id: 4,
      iconName: "list-outline",
      text1: "Vacation",
      text2: "list",
    },
    {
      id: 5,
      iconName: "person-circle-outline",
      text1: "My Card",
    },
    {
      id: 6,
      iconName: "people-outline",
      text1: "Contacts",
    },
    {
      id: 7,
      iconName: "qr-code",
      text1: "My QR",
    },
    {
      id: 8,
      iconName: "trail-sign-outline",
      text1: "Trip",
      text2: "details",
      url: "Trip details",
    },
  ];
  const handleClick = (item) => {
    if (activeButtons?.some((button) => button?.id === item.id)) {
      dispatch(setRemove(item));
    } else {
      dispatch(setAdd(item)); // You probably want to dispatch here
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          width: "100%",
        }}
      >
        <View className="flex-row pb-4 pt-2 items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0  pb-4 pt-2 "
            onPress={() => navigation.goBack()}
          >
            <Entypo
              name="chevron-left"
              size={SIZES.xxxLarge - SIZES.xSmall}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <View className="justify-self-center text-center">
            <Text className="text-lg font-medium">Quick Access Menu</Text>
          </View>
        </View>
      </View>
      <View
        className="bg-white flex-row px-3 space-x-1 flex-wrap"
        style={{
          width: "100%",
        }}
      >
        {quickAccessItems.map((item) => (
          <TouchableOpacity
            key={item.iconName}
            onPress={() => handleClick(item)}
            className={`${
              activeButtons?.some((button) => button?.id === item?.id)
                ? "bg-orange-500"
                : "bg-orange-100"
            } items-center justify-center rounded-lg  mx-1 my-2`}
            style={{
              width: 110,
              height: 110,
              flexGrow: 0.5,
            }}
          >
            <ButtonItem
              iconName={item.iconName}
              text1={item.text1}
              text2={item.text2 || null}
            />
          </TouchableOpacity>
        ))}
       
      </View>
    </SafeAreaView>
  );
};

export default SelectQuickAccess;
