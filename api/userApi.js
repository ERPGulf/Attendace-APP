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
        if (status === 200) return Promise.resolve(data.message)
    } catch (error) {
        console.error(error);

        return Promise.reject('Please retry or scan again')
    }
}

export const getOfficeLocation = async (employeeCode) => {
    try {
        const filters = [['name', '=', employeeCode]];
        const fields = ['name', 'first_name', 'custom_reporting_location'];
        const access_token = await AsyncStorage.getItem('access_token')
        const { data, status } = await userApi.get('resource/Employee', {
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            params: {
                filters: JSON.stringify(filters),
                fields: JSON.stringify(fields)
            },
        })

        console.log(data[0].custom_reporting_location);
    } catch (error) {
        console.log(error);
        return Promise.reject('Something went wrong')
    }
}