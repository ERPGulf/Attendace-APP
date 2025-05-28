import { ScrollView, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { LavaMenu, QuickAccess, WelcomeCard } from '../components/Home';

function Home() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 68,
      }}
      className="bg-gray-200"
    >
      <ScrollView
        style={{ width: '95%' }}
        contentContainerStyle={{ justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        StickyHeaderComponent={WelcomeCard}
        alwaysBounceVertical
      >
        <WelcomeCard />
        <QuickAccess navigation={navigation} />
        <LavaMenu navigation={navigation} />
      </ScrollView>
    </View>
  );
}

export default Home;
