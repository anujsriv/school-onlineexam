import axios from "axios";
import {API_BASE_URL} from '../../constants/apiContants';

const instance = axios.create({
    baseURL: API_BASE_URL
});

instance.interceptors.request.use(
    function(config) {
        const tenantID = localStorage.getItem('tenantID') || '';
        if (tenantID) {
            config.headers['X-TenantID'] = tenantID;
        }
        return config;
    },
    function(error) {
      return Promise.reject(error);
    }
);

export default instance;