import axios from "axios";
import {API_BASE_URL} from '../../constants/apiContants';

const instance = axios.create({
    baseURL: API_BASE_URL
});

instance.interceptors.request.use(
    function(config) {
        const tenantID = localStorage.getItem('tenantID') || '';
        const videoAppID = localStorage.getItem('videoAppID') || '';
        
        if (tenantID) {
            config.headers['X-TenantID'] = tenantID;
        }
        if (videoAppID) {
            config.headers['X-VideoAppID'] = videoAppID;
        }

        return config;
    },
    function(error) {
      return Promise.reject(error);
    }
);

export default instance;