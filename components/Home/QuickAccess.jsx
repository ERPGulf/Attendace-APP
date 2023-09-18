import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../../constants";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { activeButtonsSelector } from "../../redux/Slices/QuickAccessSlice";
import ButtonItem from "../SelectQuickAccess/ButtonItem";
import { useNavigation } from "@react-navigation/native";

const QuickAccess = () => {
  const navigation = useNavigation();
  const activeButtons = useSelector(activeButtonsSelector);
  return (
    <View className="mt-4 w-full">
      <View className="flex-row justify-between items-center ">
        <Text className="text-sm font-semibold">Quick Access</Text>
        <TouchableOpacity
          className="flex-row space-x-2 items-center"
          onPress={() => navigation.navigate("Quick access")}
        >
          <Text className="text-sm font-semibold" style={{ color: COLORS.red }}>
            Add New
          </Text>
          <FontAwesome name="plus" size={SIZES.xLarge} color={COLORS.red} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderRadius: Platform.OS === "android" ? 0 : "12px",
          backgroundColor: "white",
        }}
        className="border-dashed flex-wrap flex-row justify-evenly border-red-900 border-2 mt-2 p-2 "
      >
        {activeButtons.length > 0 ? (
          activeButtons?.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  item?.url && navigation.navigate(item.url);
                }}
                key={item?.iconName}
              >
                <ButtonItem
                  iconName={item?.iconName}
                  text1={item?.text1}
                  text2={item?.text2 || null}
                />
              </TouchableOpacity>
            );
          })
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Quick access")}
            className="items-center justify-center mx-auto my-10"
          >
            <AntDesign
              name="addfile"
              size={SIZES.xxxLarge - 4}
              color={COLORS.red}
            />
            <Text className="text-xs mt-2 font-light text-gray-800">
              Add quick shortcuts to your most used features
            </Text>
            <Text className="text-xs font-light text-gray-800">
              here to access them quickly
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default QuickAccess;
