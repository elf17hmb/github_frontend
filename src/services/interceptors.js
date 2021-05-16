
import axios from 'axios'
// import API_Service from '../services/API'
export function interceptors() {
    axios.interceptors.request.use(
        async function (config) {
            const token = sessionStorage.getItem('patoken')
            if (token != null) {
                config.headers.Authorization = 'token ' + token;
            }

            return config;
        });

    axios.interceptors.response.use(null, (error) => {
            console.log("ERROR HAPPENED: " + error)
        }
    )
}