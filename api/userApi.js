import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from './apiManger';
export const generateToken = async (formdata) => {
    try {
        userApi.defaults.baseURL = await AsyncStorage.getItem('baseUrl')
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
        const access_token = await AsyncStorage.getItem('access_token')
        const { data } = await userApi.get('resource/Employee', {
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
            params: {
                filters: JSON.stringify(filters),
                fields: JSON.stringify(fields)
            },
        })
        if (data.data && data.data.length > 0) {
            // Parse custom_reporting_location assuming it's a JSON string
            const jsonData = JSON.parse(data.data[0].custom_reporting_location);
            const latitude = jsonData.features[0].geometry.coordinates[1];
            const longitude = jsonData.features[0].geometry.coordinates[0];
            return Promise.resolve({ latitude, longitude }); // Return the parsed data
        } else {
            console.log("No data available");
            return Promise.reject("No data available"); // Return null when no data is available
        }
    } catch (error) {
        console.error(error, 'location');
        return Promise.reject('Something went wrong')
    }
}


export const userCheckIn = async (fielddata) => {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        const params = {
            employee_field_value: fielddata.employeeCode,
            timestamp: fielddata.timestamp,
            device_id: 'MobileAPP',
            log_type: 'IN'
        };

        const { data } = await userApi.post('method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log_based_on_employee_field', null, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            },
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
        const access_token = await AsyncStorage.getItem('access_token');
        const { data } = await userApi.post('method/upload_file', formdata, {
            headers: {
                'Accept': 'application/json',
                "Authorization": `Bearer ${access_token}`
            }
        })
        console.log(data.message);
        return Promise.resolve(data.message)
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")

    }
}

export const putUserFile = async (formData, fileId) => {
    try {
        const access_token = await AsyncStorage.getItem('access_token');
        userApi.put(`resource/Employee Checkin/${fileId}`, formData, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(() => {
            return Promise.resolve()
        }).catch(() => {
            return Promise.reject("something went wrong")
        })
    } catch (error) {
        console.error(error)
        return Promise.reject("something went wrong")
    }
}