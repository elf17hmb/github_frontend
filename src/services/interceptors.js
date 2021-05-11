
import axios from 'axios'
export function interceptors() {
    axios.interceptors.request.use(function (config) {
        const token = sessionStorage.getItem('patoken')
        if (token != null) {
            config.headers.Authorization = 'token ' + token;
        }

        return config;
    }, function (err) {
        return Promise.reject(err);
    });
}