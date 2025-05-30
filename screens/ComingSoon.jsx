import { View, Text, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, SIZES } from '../constants';

function ComingSoon() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: 'Coming soon',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity className="" onPress={() => navigation.goBack()}>
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - 5}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Coming soon!</Text>
    </View>
  );
}

export default ComingSoon;
