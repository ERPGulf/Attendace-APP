import Axios from 'axios';

const userApi = Axios.create({
    timeout:5000
})

export default userApi;