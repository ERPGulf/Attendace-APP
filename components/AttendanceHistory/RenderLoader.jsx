import { ActivityIndicator, View } from "react-native";
const RenderLoader = ({isLoading}) => {
  return isLoading ? (
    <View style={styles.loaderStyle}>
    <ActivityIndicator size="large" color="black" />
    </View>
  ) : null;
};

export default RenderLoader;
