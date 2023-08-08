import Axios from 'axios';
import { AsyncStorage } from 'react-native';

const userApi = Axios.create()

export const generateToken = async (creds) => {
    try {
        const { data } = await userApi.post(creds.url)
        await AsyncStorage.setItem(
            'access_token', data.access_token
        )
        await AsyncStorage.setItem(
            'refresh_token', data.refresh_token
        )
    } catch (error) {
        console.error(error);
    }
}

