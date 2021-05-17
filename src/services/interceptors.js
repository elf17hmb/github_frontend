
import axios from 'axios'
import toast from './toast';
// import API_Service from '../services/API'
export function interceptors() {
    axios.interceptors.request.use(
        async function (config) {
            const token = sessionStorage.getItem('patoken')
            if (token != null) {
                config.headers.Authorization = 'token ' + token;
            }

            return config;
        },
        (error) => {
            toast.apiError(error);
            return Promise.reject(error.message)
        });

    axios.interceptors.response.use(null, (error) => {
        toast.apiError(error);
        return Promise.reject(error.message)
    }
    )
}