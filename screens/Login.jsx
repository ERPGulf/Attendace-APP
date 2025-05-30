import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { setSignIn } from '../redux/Slices/AuthSlice';
import { generateToken } from '../api/userApi';
import { COLORS, SIZES } from '../constants';
import { WelcomeCard } from '../components/Login';

function Login() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(5, 'Too short!')
      .max(24, 'Too Long!')
      .required('Please enter your password.'),
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
      }}
      className="bg-gray-100 px-3 justify-between relative"
    >
      <WelcomeCard />
      <Formik
        initialValues={{
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={({ password }) => {
          setIsLoading(true);
          generateToken(password)
            .then(async data => {
              await AsyncStorage.setItem('access_token', data.access_token);
              await AsyncStorage.setItem('refresh_token', data.refresh_token);
              Toast.show({
                type: 'success',
                text1: 'login success',
                autoHide: true,
                visibilityTime: 3000,
              });
              dispatch(
                setSignIn({ isLoggedIn: true, token: data.access_token }),
              );
              setIsLoading(false);
            })
            .catch(() => {
              Toast.show({
                type: 'error',
                text1: `login failed`,
                autoHide: true,
                visibilityTime: 3000,
              });
              setIsLoading(false);
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          isValid,
          setFieldTouched,
        }) => (
          <>
            <View style={{ width: '100%', marginTop: 5 }}>
              <Text className="text-lg my-1 text-gray-600">password</Text>
              <View className="bg-white h-14 px-3 rounded-xl items-center justify-between border-gray-200 border flex-row">
                <TextInput
                  secureTextEntry={!show}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder="enter password"
                  textContentType="password"
                  onBlur={() => setFieldTouched('password')}
                  style={{ marginTop: Platform.OS === 'ios' ? -10 : 0 }}
                  className="flex-1 h-12 text-lg"
                />
                <TouchableOpacity
                  onPress={() => {
                    setShow(prev => !prev);
                  }}
                >
                  <Ionicons
                    name={show ? 'eye' : 'eye-off'}
                    size={SIZES.xLarge}
                    color={COLORS.gray2}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {touched.password && errors.password && (
              <View style={{ width: '100%' }} className="left-1 mt-1">
                <Text className="text-red-600 text-base">
                  {errors.password}
                </Text>
              </View>
            )}

            <View
              style={{ width: '100%', flex: 1, justifyContent: 'flex-end' }}
            >
              <TouchableOpacity
                disabled={!isValid || isLoading}
                onPress={handleSubmit}
                className={`h-16 rounded-xl justify-center items-center ${
                  !isValid && 'opacity-70'
                }`}
                style={{ width: '100%', backgroundColor: COLORS.primary }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <Text className="text-xl font-bold text-white">Login</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Qrscan')}
                className="border h-16 rounded-xl my-4 justify-center items-center bg-white"
                style={{ width: '100%', borderColor: COLORS.primary }}
              >
                <Text
                  className="text-xl font-semibold "
                  style={{ color: COLORS.primary }}
                >
                  Rescan code
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

export default Login;
