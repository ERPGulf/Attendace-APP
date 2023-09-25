import Axios from "axios";

const userApi = Axios.create({
  timeout: 15000,
});

export default userApi;
