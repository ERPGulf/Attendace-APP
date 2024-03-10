import { ActivityIndicator, Text, View } from "react-native";
import { COLORS } from "../../constants";
const RenderLoader = ({ isLoading, hasNextPage }) => {
  return (
    <View className='my-1'>
      {isLoading && (
        <View>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      )}
      {!isLoading && hasNextPage && (
        <View>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      )}
      {!hasNextPage && !isLoading && (
        <View>
          <Text>No more data</Text>
        </View>
      )}
    </View>
  );
};

export default RenderLoader;
