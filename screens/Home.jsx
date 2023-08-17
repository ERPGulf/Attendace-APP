import { ScrollView } from "react-native";
import React from "react";
import { LavaMenu, QuickAccess, WelcomeCard } from "../components/Home";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
      }}
      className="bg-gray-100 pb-4"
    >
      <ScrollView
        style={{ width: "95%" }}
        contentContainerStyle={{ justifyContent: "center" }}
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
