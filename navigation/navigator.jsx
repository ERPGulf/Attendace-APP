import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/Slices/AuthSlice';
import AppNavigator from './app-navigator';
import AuthNavigator from './auth-navigator';

function Navigator() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default Navigator;
