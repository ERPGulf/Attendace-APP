import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { Home } from './screens';
import { COLORS } from './constants';

export default function App() {
  return (
    <>
      <StatusBar style={
        'auto'
      } animated />
      <Home />
    </>
  );
}
