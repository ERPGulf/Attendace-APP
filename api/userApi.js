import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from './apiManger';
export const generateToken = async (formdata) => {
    try {
        const baseURL = await AsyncStorage.getItem('baseUrl')
        userApi.defaults.baseURL = baseURL
        const { data, status } = await userApi.post(`method/employee_app.gauth.generate_custom_token`, formdata)
        if (data.message.message === "Invalid login credentials") {
            return Promise.reject("invalid password")
        }
        return data
    } catch (error) {
        console.error(error);
        return Promise.reject('Please retry or scan again')
    }
}

