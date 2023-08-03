import { SafeAreaView, Platform, ScrollView } from "react-native";
import React from "react";

import { COLORS } from "../../constants";
import { LavaMenu, QuickAccess, WelcomeCard } from "../../components/Home";

const Home = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" && 50,
        alignItems: "center",
        backgroundColor: COLORS.lightWhite,
      }}
      className="mx-3"
    >
      <ScrollView style={{ width: "100%" }}>
        <WelcomeCard />
        <QuickAccess />
        <LavaMenu />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
