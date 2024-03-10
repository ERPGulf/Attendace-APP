import { ActivityIndicator, Text, View } from "react-native";
import { COLORS } from "../../constants";
const RenderLoader = ({ isLoading, hasNextPage }) => {
  return (
    <View>
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
      {!hasNextPage && (
        <View>
          <Text>No more data</Text>
        </View>
      )}
    </View>
  );
};

export default RenderLoader;
