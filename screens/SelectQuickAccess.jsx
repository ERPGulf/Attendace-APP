import { View, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { COLORS, SIZES } from "../constants";
import Entypo from "@expo/vector-icons/Entypo";
import ButtonItem from "../components/SelectQuickAccess/ButtonItem";
import { useDispatch, useSelector } from "react-redux";
import {
  activeButtonsSelector,
  setAdd,
  setRemove,
} from "../redux/Slices/QuickAccessSlice";
import { useNavigation } from "@react-navigation/native";
const SelectQuickAccess = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: "Quick Access",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity className="" onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - SIZES.xSmall}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
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
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
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
                ? "bg-gray-400"
                : "bg-gray-200"
            } items-center  rounded-lg  mx-1 my-2`}
            style={{
              width: SIZES.width / 4,
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
    </View>
  );
};

export default SelectQuickAccess;
