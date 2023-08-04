import { SafeAreaView, Platform, ScrollView, StatusBar } from "react-native";
import React from "react";

import { LavaMenu, QuickAccess, WelcomeCard } from "../components/Home";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingTop: Platform.OS == "android" && StatusBar.currentHeight,
      }}
    >
      <ScrollView
        style={{ width: "95%" }}
        showsVerticalScrollIndicator={false}
        StickyHeaderComponent={WelcomeCard}
        alwaysBounceVertical
        automaticallyAdjustContentInsets
      >
        <WelcomeCard />
        <QuickAccess />
        <LavaMenu navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
