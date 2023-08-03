import { SafeAreaView, Platform, ScrollView, StatusBar } from "react-native";
import React from "react";

import { LavaMenu, QuickAccess, WelcomeCard } from "../components/Home";

const Home = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: Platform.OS == "android" && StatusBar.currentHeight,
      }}
      className="mx-3"
    >
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        StickyHeaderComponent={WelcomeCard}
        alwaysBounceVertical
        automaticallyAdjustContentInsets
             >
        <WelcomeCard />
        <QuickAccess />
        <LavaMenu />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
