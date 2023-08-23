import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import Entypo from "@expo/vector-icons/Entypo";
import ButtonItem from "../components/SelectQuickAccess/ButtonItem";
const SelectQuickAccess = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState([]);
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 12,
          flexWrap: "wrap",
        }}
      >
        <View
          className="flex-row items-center bg-orange-200 justify-center rounded-lg mx-1 my-2"
          style={{ width: 110, height: 110 }}
        >
          <ButtonItem
            iconName={"calendar-outline"}
            text1={"Attendance"}
            text2={"action"}
          />
        </View>
        <View
          className="flex-row items-center bg-orange-200 justify-center rounded-lg mx-1 my-2"
          style={{ width: 110, height: 110 }}
        >
          <ButtonItem
            iconName={"calendar-outline"}
            text1={"Attendance"}
            text2={"action"}
          />
        </View>
        <View
          className="flex-row items-center bg-orange-200 justify-center rounded-lg mx-1 my-2"
          style={{ width: 110, height: 110 }}
        >
          <ButtonItem
            iconName={"calendar-outline"}
            text1={"Attendance"}
            text2={"action"}
          />
        </View>
        <View
          className="flex-row items-center bg-orange-200 justify-center rounded-lg mx-1 my-2"
          style={{ width: 110, height: 110 }}
        >
          <ButtonItem
            iconName={"calendar-outline"}
            text1={"Attendance"}
            text2={"action"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectQuickAccess;
