import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { getUserAttendance } from '../api/userApi';
import { selectEmployeeCode } from '../redux/Slices/UserSlice';
import { LogCard, RenderLoader } from '../components/AttendanceHistory';
import { COLORS, SIZES } from '../constants';

function AttendanceHistory() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerShown: true,
      headerTitle: 'Attendance history',
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
  // const [data, setData] = useState(null);
  const employeeCode = useSelector(selectEmployeeCode);

  const { isLoading, isError, data, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['attendance', employeeCode],
      queryFn: ({ pageParam = 0 }) =>
        getUserAttendance(employeeCode, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return undefined;
        return allPages.length; //
      },
    });
  const loadMoreItem = () => {
    fetchNextPage();
  };
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">No data found</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      <FlashList
        data={data?.pages?.flatMap(page => page)}
        contentContainerStyle={{
          paddingVertical: 15,
          paddingHorizontal: 15,
          backgroundColor: COLORS.white,
        }}
        renderItem={({ item }) => (
          <LogCard type={item.log_type} time={item.time} />
        )}
        ListFooterComponent={
          <RenderLoader isLoading={isLoading} hasNextPage={hasNextPage} />
        }
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
        estimatedItemSize={50}
      />
    </View>
  );
}

export default AttendanceHistory;
