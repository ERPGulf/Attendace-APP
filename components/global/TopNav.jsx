import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';

function TopNav({ navigation, title }) {
  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <View className="flex-row pb-4 pt-2 items-center justify-center relative">
        <TouchableOpacity
          className="absolute left-0  pb-4 pt-2 "
          onPress={() => navigation.goBack()}
        >
          <Entypo
            name="chevron-left"
            size={SIZES.xxxLarge - 5}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <View className="justify-self-center text-center">
          <Text className="text-lg font-medium">{title}</Text>
        </View>
      </View>
    </View>
  );
}

export default TopNav;
