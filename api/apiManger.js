import Axios from 'axios';

const userApi = Axios.create({
  baseURL: 'https://castle.erpgulf.com:1813/api/',
  timeout: 35000,
});

export default userApi;
