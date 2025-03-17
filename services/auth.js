import AsyncStorage from "@react-native-async-storage/async-storage";
import userApi from "./apiClient";

const setCommonHeaders = () => ({
  "Content-Type": "multipart/form-data",
});

export const refreshAccessToken = async () => {
  try {
    const refresh_token = await AsyncStorage.getItem("refresh_token");

    const formdata = new FormData();
    formdata.append("grant_type", "refresh_token");
    formdata.append("refresh_token", refresh_token);

    const { data } = await userApi.post(
      "method/frappe.integrations.oauth2.get_token",
      formdata,
      { headers: setCommonHeaders() }
    );

    await AsyncStorage.multiSet([
      ["access_token", data.access_token],
      ["refresh_token", data.refresh_token],
    ]);

    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Token refresh failed");
  }
};

export const generateToken = async (password) => {
  try {
    const formData = new FormData();
    formData.append("password", password);

    const { data } = await userApi.post(
      "method/employee_app.gauth.generate_custom_token_for_employee",
      formData,
      { headers: setCommonHeaders() }
    );

    if (data.message.message === "Invalid login credentials") {
      throw new Error("Invalid login credentials");
    }

    return data.message;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login went wrong");
  }
};
