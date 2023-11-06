import { ActivityIndicator, View } from "react-native";
const RenderLoader = ({isLoading}) => {
  return isLoading ? (
    <View style={styles.loaderStyle}>
      <ActivityIndicator size="large" color="#aaa" />
    </View>
  ) : null;
};

export default RenderLoader;
