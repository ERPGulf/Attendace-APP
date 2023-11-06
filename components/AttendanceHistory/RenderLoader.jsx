import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../../constants";
const RenderLoader = () => {
  return (
    <View>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default RenderLoader;
