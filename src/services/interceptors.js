
import axios from 'axios'
import toast from './toast'
import router from '../router'
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
        if (error.response.status === 401) {
            router.push({ name: 'Login' })
        }
        if (Object.prototype.hasOwnProperty.call(error.config, 'handleError') && error.config.handleError === false && error.response.status != 401) {
            return Promise.reject(error)
        }
        toast.apiError(error);
    }
    )
}