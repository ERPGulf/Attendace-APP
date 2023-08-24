import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AttendanceAction,
  AttendanceHistory,
  Home,
  SelectQuickAccess,
  TripDetails,
} from "../screens";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Trip details"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="Attendance action" component={AttendanceAction} />
      <Stack.Screen name="Attendance history" component={AttendanceHistory} />
      <Stack.Screen name="Quick access" component={SelectQuickAccess} />
      <Stack.Screen name="Trip details" component={TripDetails} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
