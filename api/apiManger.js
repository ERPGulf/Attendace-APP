import Axios from 'axios';

const userApi = Axios.create({
  timeout: 35000,
});

export default userApi;
