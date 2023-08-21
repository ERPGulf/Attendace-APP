import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from './apiManger';
// import { store } from '../redux/Store'
// import { setSignOut } from '../redux/Slices/AuthSlice';



const refreshAccessToken = async () => {
    try {
        const refresh_token = await AsyncStorage.getItem('refresh_token')
        const formdata = new FormData()
        formdata.append('grant_type', 'refresh_token')
        formdata.append('refresh_token', refresh_token)

        const { data } = await userApi.post('method/frappe.integrations.oauth2.get_token', formdata, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        })
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('refresh_token', data.refresh_token);
        return data.access_token

    } catch (error) {
        console.error('Token refresh error:', error);
        return Promise.reject(error)
    }
};

// ... Rest of the code ...

let refreshPromise = null;
const clearPromise = () => refreshPromise = null;
userApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && (error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(clearPromise)
            }
            const token = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return userApi(originalRequest);
        }
        return Promise.reject(error);
    }
);

userApi.interceptors.request.use(
    async (config) => {
        const access_token = await AsyncStorage.getItem('access_token')
        config.baseURL = await AsyncStorage.getItem('baseUrl')
        config.headers.Authorization = `Bearer ${access_token}`
        return config;
    },
    (error) => Promise.reject(error)
);

export const generateToken = async (formdata) => {
    try {
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
        const { data } = await userApi.get('resource/Employee', {

            params: {
                filters: JSON.stringify(filters),
                fields: JSON.stringify(fields)
            },
        })

        // Parse custom_reporting_location assuming it's a JSON string
        const jsonData = JSON.parse(data.data[0].custom_reporting_location);
        const latitude = jsonData.features[0].geometry.coordinates[1];
        const longitude = jsonData.features[0].geometry.coordinates[0];
        return Promise.resolve({ latitude, longitude }); // Return the parsed data

    } catch (error) {
        console.error(error, 'location');
        return Promise.reject('Something went wrong')
    }
}


export const userCheckIn = async (fielddata) => {
    try {
        const params = {
            employee_field_value: fielddata.employeeCode,
            timestamp: fielddata.timestamp,
            device_id: 'MobileAPP',
            log_type: fielddata.type
        };

        const { data } = await userApi.post('method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log_based_on_employee_field', null, {
            params
        });
        return Promise.resolve(data.message);
    } catch (error) {
        console.error(error, 'checkin');
        return Promise.reject("something went wrong")
    }
};


export const userFileUpload = async (formdata) => {
    try {
        const { data } = await userApi.post('method/upload_file', formdata,)
        return Promise.resolve(data.message)
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")

    }
}

export const putUserFile = async (formData, fileId) => {
    try {
        userApi.put(`resource/Employee Checkin/${fileId}`, formData,).then(() => {
            return Promise.resolve()
        }).catch(() => {
            return Promise.reject("something went wrong")
        })
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")
    }
}

export const userStatusPut = async (employeeCode, custom_in) => {
    try {
        const { data } = userApi.put(`resource/Employee/${employeeCode}`, { custom_in },)
        return Promise.resolve(data)
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")
    }
}


export const getUserCustomIn = async (employeeCode) => {
    try {
        const filters = [['name', '=', employeeCode]];
        const fields = ['name', 'first_name', 'custom_in', 'custom_restrict_location'];

        const queryParams = new URLSearchParams({
            filters: JSON.stringify(filters),
            fields: JSON.stringify(fields)
        });
        const { data } = await userApi.get(`resource/Employee?${queryParams}`,)
        return Promise.resolve(data)
    } catch (error) {
        console.error(error, 'status')
        return Promise.reject("something went wrong")
    }
}


// export const checkUserWFH = async () => {
//     try {
//         const filters = [['name', '=', employeeCode]];
//         const fields = ['name', 'first_name', 'custom_in'];
//         const queryParams = new URLSearchParams({
//             filters: JSON.stringify(filters),
//             fields: JSON.stringify(fields)
//         });
//         const { data } = await userApi.get(`resource/Employee?${queryParams}`,)
//     } catch (error) {
//         console.error(error, 'WFH')
//         return Promise.reject("something went wrong")
//     }
// }
