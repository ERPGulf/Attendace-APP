import AsyncStorage from "@react-native-async-storage/async-storage";
import userApi from "./apiManger";

// seting common headers
const setCommonHeaders = (headers = {}) => {
  headers["Content-Type"] = "multipart/form-data";
  return headers;
};

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
        headers: setCommonHeaders(),
      }
    );
    AsyncStorage.multiSet([
      ["access_token", data.access_token],
      ["refresh_token", data.refresh_token],
    ]);
    return Promise.resolve(data.access_token);
  } catch (error) {
    console.error("Token refresh error:", error);
    return Promise.reject(new Error("Token refresh failed"));
  }
};

// ... refresh middleware ...

let refreshPromise = null;
const clearPromise = () => (refreshPromise = null);

userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      [400, 403, 401].includes(error.response.status) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(clearPromise);
        }

        const token = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request with the new token
        return userApi(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Handle refresh error appropriately, e.g., log out user or redirect to login
        return Promise.reject(refreshError);
      }
    }

    // If the error is not related to token expiration, reject the promise
    return Promise.reject(error);
  }
);
// baseUrl and accessToken preset middleware
userApi.interceptors.request.use(
  async (config) => {
    if (config.url === "method/frappe.integrations.oauth2.get_token") {
      config.baseURL = await AsyncStorage.getItem("baseUrl");
      return config;
    }
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
        headers: setCommonHeaders(),
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
    console.log(data,'test')
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
      formData,
      {
        headers: setCommonHeaders(),
      }
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
      headers: setCommonHeaders(),
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
        headers: setCommonHeaders(),
      }
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error, "image");
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
        headers: setCommonHeaders(),
      }
    );
    return Promise.resolve(data);
  } catch (error) {
    console.error(error, "status put");
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
      "custom_reporting_radius",
    ];
    const { data } = await userApi.get(`resource/Employee`, {
      params: {
        filters: JSON.stringify(filters),
        fields: JSON.stringify(fields),
      },
    });
    return Promise.resolve(data.data[0]);
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
        headers: setCommonHeaders(),
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
        headers: setCommonHeaders(),
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
        headers: setCommonHeaders(),
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
        headers: setCommonHeaders(),
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

export const getUserAttendance = async (employee_code, limit_start) => {
  try {
    const { data } = await userApi.get(
      `method/employee_app.attendance_api.employee_checkin`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          employee_code: "HR-EMP-00032",
          limit_start: 0,
          limit_page_length: 15,
        },
      }
    );
    return Promise.resolve(data.message);
  } catch (error) {
    console.error(error, "attendance");
    return Promise.reject(new Error("Something went wrong"));
  }
};
