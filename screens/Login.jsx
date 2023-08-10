import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WelcomeCard } from "../components/Login";
import { COLORS, SIZES } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { generateToken } from "../api/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setIsAuthenticated } from "../redux/Slices/UserSlice";
import { setSignIn } from "../redux/Slices/AuthSlice";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const username = useSelector((state) => state.user.username);
  const handleLogin = () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    generateToken(formData)
      .then(async (data) => {
        await AsyncStorage.setItem("access_token", data.access_token);
        await AsyncStorage.setItem("refresh_token", data.refresh_token);
        dispatch(setSignIn({ isLoggedIn: true, token: data.access_token }));
      })
      .catch((msg) => {
        alert(msg);
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
      }}
      className="bg-gray-100 px-3 relative justify-between"
    >
      <WelcomeCard />
      <View style={{ width: "100%", marginVertical: 30 }}>
        <View className="bg-white h-14 px-3 rounded-xl items-center justify-between flex-row">
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="enter password"
            textContentType="password"
            className="w-80 h-12 text-lg"
          />
          <Ionicons
            name="lock-closed"
            size={SIZES.xLarge}
            color={COLORS.gray2}
          />
        </View>
      </View>
      <View style={{ width: "100%", flex: 1, justifyContent: "flex-end" }}>
        <TouchableOpacity
          onPress={handleLogin}
          className=" h-16 rounded-xl justify-center items-center "
          style={{ width: "100%", backgroundColor: COLORS.primary }}
        >
          <Text className="text-2xl font-bold text-white">login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Qrscan")}
          className="border-2 h-16 rounded-xl my-4 justify-center items-center bg-white
        "
          style={{ width: "100%", borderColor: COLORS.primary }}
        >
          <Text
            className="text-xl font-semiboldbold "
            style={{ color: COLORS.primary }}
          >
            Rescan code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
