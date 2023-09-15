import { ScrollView, View } from "react-native";
import React from "react";
import { LavaMenu, QuickAccess, WelcomeCard } from "../components/Home";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants'
const Home = ( ) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop:Constants.statusBarHeight
      }}
      className="bg-gray-200"
    >
      <ScrollView
        style={{ width: "95%" }}
        contentContainerStyle={{ justifyContent: "center",}}
        showsVerticalScrollIndicator={false}
        StickyHeaderComponent={WelcomeCard}
        alwaysBounceVertical
        automaticallyAdjustContentInsets
      >
        <WelcomeCard />
        <QuickAccess navigation={navigation} />
        <LavaMenu navigation={navigation} />
      </ScrollView>
    </View>
  );
};

export default Home;
