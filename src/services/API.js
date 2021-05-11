import axios from 'axios'
const API_URL = 'https://api.github.com'
class API_Service {
    getCurrentUser(){
        return axios.get(API_URL +'/user')
    }
}
export default new API_Service;