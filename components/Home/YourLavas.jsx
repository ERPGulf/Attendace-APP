import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const LavaMenu = ({ navigation }) => {
  return (
    // first row
    <View className="mt-2">
      <View>
        <Text className="text-sm font-semibold">Your Lava</Text>
      </View>
      <View className="my-2">
        <View
          className="flex-row justify-between items-center py-2.5 px-3 rounded-t-xl"
          style={{ width: "100%", backgroundColor: COLORS.primary }}
        >
          <TouchableOpacity>
            <Octicons name="people" size={SIZES.xxLarge + 4} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-white text-center ">
            Human Resources
          </Text>
          <TouchableOpacity className="bg-white justify-center items-center rounded-lg">
            <AntDesign
              name="arrowright"
              size={SIZES.xxLarge + 4}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-white flex-wrap py-2 justify-around space-x-1 rounded-b-xl mb-4">
          <TouchableOpacity
            className="m-1 w-20 h-32"
            onPress={() => {
              navigation.navigate("Attendence action");
            }}
          >
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <MaterialCommunityIcons
                name="calendar-multiple-check"
                size={SIZES.xxxLarge}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">
              Attendence
            </Text>
            <Text className="text-sm text-center font-semibold">action</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="m-1 w-20 h-32"
            onPress={() => {
              navigation.navigate("Attendence history");
            }}
          >
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <Ionicons
                name="receipt-outline"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">
              Attendence
            </Text>
            <Text className="text-sm text-center font-semibold">history</Text>
          </TouchableOpacity>
          <TouchableOpacity className="m-1 w-20 h-32">
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <Ionicons
                name="airplane-outline"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">Vacation</Text>
            <Text className="text-sm text-center font-semibold">request</Text>
          </TouchableOpacity>
          <TouchableOpacity className="m-1 w-20 h-32">
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <Ionicons
                name="list-outline"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">Vacation</Text>
            <Text className="text-sm text-center font-semibold">list</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* second row */}
      <View className="my-2">
        <View
          className="flex-row justify-between items-center py-2.5 px-3 rounded-t-xl"
          style={{ width: "100%", backgroundColor: COLORS.primary }}
        >
          <TouchableOpacity>
            <Octicons name="id-badge" size={SIZES.xxLarge + 4} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-white text-center ">
            Business card
          </Text>
          <TouchableOpacity className="bg-white justify-center items-center  rounded-lg">
            <AntDesign
              name="arrowright"
              size={SIZES.xxLarge + 4}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View className="bg-white flex-row flex-wrap p-2 justify-start space-x-5 rounded-b-xl ">
          <TouchableOpacity className="m-1 mr-0 w-20 h-32">
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <Octicons
                name="id-badge"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">My card</Text>
          </TouchableOpacity>
          <TouchableOpacity className="m-1 mr-0 w-20 h-32">
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <MaterialCommunityIcons
                name="contacts-outline"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="m-1 w-20 h-32"
            // onPress={() => navigation.navigate("")}
          >
            <View className="bg-gray-100 h-20 justify-center items-center rounded-lg">
              <Ionicons
                name="qr-code"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-sm text-center font-semibold">My QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LavaMenu;
