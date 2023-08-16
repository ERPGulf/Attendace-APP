import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from './apiManger';
import { store } from '../redux/Store'
import { setSignOut } from '../redux/Slices/AuthSlice';


let tokenRefreshRetries = 0;
const MAX_TOKEN_REFRESH_RETRIES = 3; // Maximum number of token refresh retries

userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (tokenRefreshRetries < MAX_TOKEN_REFRESH_RETRIES) {
        try {
          const tokenRefreshData = await refreshAccessToken();
          await AsyncStorage.setItem('access_token', tokenRefreshData.access_token);
          await AsyncStorage.setItem('refresh_token', tokenRefreshData.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${tokenRefreshData.access_token}`;
          tokenRefreshRetries = 0; // Reset retry count on successful refresh
          return userApi(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          tokenRefreshRetries++; // Increment retry count
          if (tokenRefreshRetries >= MAX_TOKEN_REFRESH_RETRIES) {
            console.error('Max token refresh retries reached. Logging out.');
            store.dispatch(setSignOut());
          }
        }
      } else {
        console.error('Max token refresh retries reached. Logging out.');
        store.dispatch(setSignOut());
      }
    }

    return Promise.reject(error);
  }
);


// TODO:Research on this 
userApi.interceptors.request.use(
    async (config) => {
        config.baseURL = await AsyncStorage.getItem('baseUrl')
        const accessToken = await AsyncStorage.getItem('access_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
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
        userApi.defaults.baseURL = await AsyncStorage.getItem('baseUrl')
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
            params: params
        });
        return Promise.resolve(data.message);
    } catch (error) {
        console.error(error, 'checkin');
        return Promise.reject("something went wrong")
    }
};


export const userFileUpload = async (formdata) => {
    try {
        const { data } = await userApi.post('method/upload_file', formdata)
        return Promise.resolve(data.message)
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")

    }
}

export const putUserFile = async (formData, fileId) => {
    try {
        userApi.put(`resource/Employee Checkin/${fileId}`, formData).then(() => {
            return Promise.resolve()
        }).catch(() => {
            return Promise.reject("something went wrong")
        })
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")
    }
}
export const refreshAccessToken = async () => {
    console.log("refresh token triggered");
    try {
        const refresh_token = await AsyncStorage.getItem('refresh_token')
        const formdata = new FormData()
        formdata.append('grant_type', "refresh_token",)
        formdata.append('refresh_token', refresh_token,)

        const { data } = await userApi.post('method/frappe.integrations.oauth2.get_token', formdata)
        console.log(data);
        return Promise.resolve(data)

    } catch (error) {
        console.error('Token refresh error:', error);
        return Promise.reject(error)
    }
};


export const userStatusPut = async (employeeCode, custom_in) => {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        const { data } = userApi.put(`resource/Employee/${employeeCode}`, { custom_in }, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        return Promise.resolve(data)
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")
    }
}


export const getUserCustomIn = async (employeeCode) => {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        const baseURL = await AsyncStorage.getItem('baseUrl')
        const filters = [['name', '=', employeeCode]];
        const fields = ['name', 'first_name', 'custom_in'];

        const queryParams = new URLSearchParams({
            filters: JSON.stringify(filters),
            fields: JSON.stringify(fields)
        });
        const { data,} = await userApi.get(`resource/Employee?${queryParams}`, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        console.log(data);
        return Promise.resolve(data)
    } catch (error) {
        console.error(error, 'status')
        return Promise.reject("something went wrong")
    }
}



// export const getUserCustomIn = async (employeeCode) => {
//     try {
//         const access_token = await AsyncStorage.getItem('access_token');
//         const filters = [['name', '=', employeeCode]];
//         const fields = ['name', 'first_name', 'custom_in'];

//         const queryParams = new URLSearchParams({
//             filters: JSON.stringify(filters),
//             fields: JSON.stringify(fields)
//         });

//         const url = `https://dev.claudion.com/api/resource/Employee?${queryParams.toString()}`;

//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${access_token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`API request failed with status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log(data, response.status);
//         return Promise.resolve(data);
//     } catch (error) {
//         console.error(error, 'status');
//         return Promise.reject("something went wrong");
//     }
// };
