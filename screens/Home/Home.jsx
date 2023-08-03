import { SafeAreaView, Platform, ScrollView, StatusBar } from "react-native";
import React from "react";

import { COLORS } from "../../constants";
import { LavaMenu, QuickAccess, WelcomeCard } from "../../components/Home";

const Home = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.lightWhite,
        paddingTop: Platform.OS == "android" && StatusBar.currentHeight,
      }}
      className="mx-3"
    >
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeCard />
        <QuickAccess />
        <LavaMenu />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
