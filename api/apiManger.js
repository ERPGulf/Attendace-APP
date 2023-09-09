import Axios from 'axios';

const userApi = Axios.create({
    timeout: 10000,
}
)

export default userApi;