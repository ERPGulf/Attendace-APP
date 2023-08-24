import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const LavaMenu = ({ navigation }) => {
  return (
    // first row
    <View className="my-2" style={{ width: "100%" }}>
      <View>
        <Text className="text-sm font-semibold">Your Lava</Text>
      </View>
      <View className="my-2">
        <View
          className="flex-row justify-between items-center py-2.5 px-3 rounded-t-xl"
          style={{ width: "100%", backgroundColor: COLORS.primary }}
        >
          <View>
            <Octicons name="people" size={SIZES.xxLarge + 4} color="white" />
          </View>
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
        <View className="bg-white rounded-b-xl py-3 px-2 mb-2">
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Attendance action");
              }}
              className="mr-4"
            >
              <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
                <Ionicons
                  name="calendar-outline"
                  size={SIZES.xxxLarge - 3}
                  color={COLORS.tertiary}
                />
              </View>
              <Text className="text-xs text-center font-medium text-gray-500 mt-1">
                Attendance
              </Text>
              <Text className="text-xs text-center font-medium text-gray-500">
                action
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mr-4"
              onPress={() => {
                navigation.navigate("Attendance history");
              }}
            >
              <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
                <Ionicons
                  name="receipt-outline"
                  size={SIZES.xxxLarge - 3}
                  color={COLORS.tertiary}
                />
              </View>
              <Text className="text-xs text-center font-medium text-gray-500 mt-1">
                Attendance
              </Text>
              <Text className="text-xs text-center font-medium text-gray-500">
                history
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="mr-4" onPress={()=>navigation.navigate('Trip details')}>
              <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
                <Ionicons
                  name="trail-sign-outline"
                  size={SIZES.xxxLarge - 3}
                  color={COLORS.tertiary}
                />
              </View>
              <Text className="text-xs text-center font-medium text-gray-500 mt-1">
                Trip
              </Text>
              <Text className="text-xs text-center font-medium text-gray-500">
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="mr-4">
              <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
                <Ionicons
                  name="airplane-outline"
                  size={SIZES.xxxLarge - 3}
                  color={COLORS.tertiary}
                />
              </View>
              <Text className="text-xs text-center font-medium text-gray-500 mt-1">
                Vacation
              </Text>
              <Text className="text-xs text-center font-medium text-gray-500">
                request
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="mr-4">
              <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
                <Ionicons
                  name="list-outline"
                  size={SIZES.xxxLarge - 3}
                  color={COLORS.tertiary}
                />
              </View>
              <Text className="text-xs text-center font-medium text-gray-500 mt-1">
                Vacation
              </Text>
              <Text className="text-xs text-center font-medium text-gray-500">
                list
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      {/* second row */}
      <View className="mb-2">
        <View
          className="flex-row justify-between items-center py-2.5 px-3 rounded-t-xl"
          style={{ width: "100%", backgroundColor: COLORS.primary }}
        >
          <View>
            <Octicons name="id-badge" size={SIZES.xxLarge + 4} color="white" />
          </View>
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
        <View className="flex-row bg-white flex-wrap py-4 justify-around px-2 rounded-b-xl ">
          <TouchableOpacity className="w-16">
            <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
              <Ionicons
                name="person-circle-outline"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-xs text-center font-medium text-gray-500 mt-1">
              My card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-16">
            <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
              <Ionicons
                name="people-outline"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-xs text-center font-medium text-gray-500 mt-1">
              Contacts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-16">
            <View className="bg-gray-100 p-2 justify-center items-center rounded-lg w-16">
              <Ionicons
                name="qr-code"
                size={SIZES.xxxLarge - 3}
                color={COLORS.tertiary}
              />
            </View>
            <Text className="text-xs text-center font-medium text-gray-500 mt-1">
              My QR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LavaMenu;
