import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AttendanceAction, AttendanceHistory, Home, SelectQuickAccess } from "../screens";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="Attendance action" component={AttendanceAction} />
      <Stack.Screen name="Attendance history" component={AttendanceHistory} />
      <Stack.Screen name="Quick access" component={SelectQuickAccess} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
