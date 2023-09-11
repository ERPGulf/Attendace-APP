import AsyncStorage from "@react-native-async-storage/async-storage";
import userApi from "./apiManger";

// refresh accessToken
const refreshAccessToken = async () => {
  try {
    const refresh_token = await AsyncStorage.getItem("refresh_token");
    const formdata = new FormData();
    formdata.append("grant_type", "refresh_token");
    formdata.append("refresh_token", refresh_token);
    const { data } = await userApi.post(
      "method/frappe.integrations.oauth2.get_token",
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (data.access_token) {
      await AsyncStorage.setItem("access_token", data.access_token);
      await AsyncStorage.setItem("refresh_token", data.refresh_token);
      return data.access_token;
    } else {
      return Promise.reject(new Error("No access token in response"));
    }
  } catch (error) {
    console.error(
      "Token refresh error:",
      error.response || error.message || error
    );
    return Promise.reject(error);
  }
};
// ... refresh middleware ...

// This code intercepts any response from the api that is of status 400, 417, 403, or 401. It then checks if the refreshPromise variable is null, if it is, it sets it to refreshAccessToken(). If it is not null, it does nothing. It then returns the originalRequest. If the status code is not one of the above, the code rejects the error.

let refreshPromise = null;
const clearPromise = () => (refreshPromise = null);
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 400 ||
        error.response.status === 417 ||
        error.response.status === 403 ||
        error.response.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(clearPromise);
      }
      const token = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return userApi(originalRequest);
    }
    return Promise.reject(error);
  }
);
// baseUrl and accessToken preset middleware
userApi.interceptors.request.use(
  async (config) => {
    const access_token = await AsyncStorage.getItem("access_token");
    config.baseURL = await AsyncStorage.getItem("baseUrl");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// generate user tokens
export const generateToken = async (password) => {
  const formData = new FormData();
  formData.append("password", password);
  try {
    const { data, status } = await userApi.post(
      `method/employee_app.gauth.generate_custom_token_for_employee`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (data.message.message === "Invalid login credentials") {
      return Promise.reject(new Error("Invalid login credentials"));
    }
    if (status === 200) return Promise.resolve(data.message);
  } catch (error) {
    console.error(error);
    return Promise.reject(new Error("Login went wrong"));
  }
};
// get user location
export const getOfficeLocation = async (employeeCode) => {
  try {
    const filters = [["name", "=", employeeCode]];
    const fields = ["name", "first_name", "custom_reporting_location"];
    const { data } = await userApi.get("resource/Employee", {
      params: {
        filters: JSON.stringify(filters),
        fields: JSON.stringify(fields),
      },
    });

    // Parse custom_reporting_location assuming it's a JSON string
    const jsonData = JSON.parse(data.data[0].custom_reporting_location);
    const latitude = jsonData.features[0].geometry.coordinates[1];
    const longitude = jsonData.features[0].geometry.coordinates[0];
    return Promise.resolve({ latitude, longitude }); // Return the parsed data
  } catch (error) {
    console.error(error, "location");
    return Promise.reject(new Error("location went wrong"));
  }
};

// user checkin/checkout
export const userCheckIn = async (fielddata) => {
  try {
    const formData = new FormData();
    formData.append("employee_field_value", fielddata.employeeCode);
    formData.append("timestamp", fielddata.timestamp);
    formData.append("device_id", "MobileAPP");
    formData.append("log_type", fielddata.type);
    const { data } = await userApi.post(
      "method/hrms.hr.doctype.employee_checkin.employee_checkin.add_log_based_on_employee_field",
      formData
    );
    if (!data) return Promise.reject(new Error("Employee not found"));
    return Promise.resolve(data?.message);
  } catch (error) {
    console.error(error, "checkin");
    return Promise.reject(new Error("something went wrong"));
  }
};

// user file upload
export const userFileUpload = async (formdata) => {
  try {
    const { data } = await userApi.post("method/upload_file", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return Promise.resolve(data.message);
  } catch (error) {
    console.error(error);
    return Promise.reject(new Error("something went wrong"));
  }
};
// putting user file
export const putUserFile = async (formData, fileId) => {
  try {
    const { data } = await userApi.put(
      `resource/Employee Checkin/${fileId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const userStatusPut = async (employeeCode, custom_in) => {
  try {
    const formData = new FormData();
    formData.append("custom_in", custom_in);
    const { data } = await userApi.put(
      `resource/Employee/${employeeCode}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error);
    return Promise.reject(new Error("something went wrong"));
  }
};
// geting user status
export const getUserCustomIn = async (employeeCode) => {
  try {
    const filters = [["name", "=", employeeCode]];
    const fields = [
      "name",
      "first_name",
      "custom_in",
      "custom_restrict_location",
    ];
    const { data } = await userApi.get(`resource/Employee`, {
      params: {
        filters: JSON.stringify(filters),
        fields: JSON.stringify(fields),
      },
    });
    return Promise.resolve(data);
  } catch (error) {
    console.error(error, "status");
    return Promise.reject(new Error("something went wrong"));
  }
};

export const tripTrack = async (formData) => {
  try {
    const { data } = await userApi.post(
      "method/employee_app.attendance_api.insert_new_trip",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!data.message) return Promise.reject(new Error("Trip not started"));
    return Promise.resolve(data.message);
  } catch (error) {
    console.error(error, "trip");
    return Promise.reject(new Error("something went wrong"));
  }
};

export const userTripStatus = async (employeeCode) => {
  try {
    const { data } = await userApi.get(
      "method/employee_app.attendance_api.get_latest_open_trip",
      {
        params: {
          employee_id: employeeCode,
        },
      }
    );
    return Promise.resolve(data.message);
  } catch (error) {
    console.error(error, "trip status");
    return Promise.reject(new Error("Something went wrong)"));
  }
};

export const endTripTrack = async (formData) => {
  try {
    const { data } = await userApi.post(
      "method/employee_app.attendance_api.close_the_trip",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!data.message) return Promise.reject(new Error("Trip not ended"));
    return Promise.resolve();
  } catch (error) {
    console.error(error, "trip end");
    return Promise.reject(new Error("something went wrong"));
  }
};

export const getContracts = async (searchTerms = "") => {
  const formData = new FormData();
  formData.append("enter_name", searchTerms);
  try {
    const { data } = await userApi.post(
      "method/employee_app.attendance_api.contract_list",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const filteredData = data?.message?.flat(1);
    if (filteredData.length === 0) {
      return Promise.resolve({ filteredData, error: "no contracts available" });
    }
    return Promise.resolve({ filteredData, error: null });
  } catch (error) {
    console.error(error, "contract");
    return Promise.reject(new Error("Something went wrong)"));
  }
};

export const getVehicle = async (searchTerms = "") => {
  const formData = new FormData();
  formData.append("vehicle_no", searchTerms);
  formData.append("odometer", "");
  formData.append("vehicle_model", "");

  try {
    const { data } = await userApi.post(
      "method/employee_app.attendance_api.vehicle_list",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const filteredData = data?.message?.flat(1);
    if (filteredData.length === 0) {
      return Promise.resolve({ filteredData, error: "no vehicle available" });
    }
    return Promise.resolve({ filteredData, error: null });
  } catch (error) {
    console.error(error, "contract");
    return Promise.reject(new Error("Something went wrong)"));
  }
};
