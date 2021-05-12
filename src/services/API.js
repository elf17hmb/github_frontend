import axios from 'axios'
const API_URL = 'https://api.github.com'
class API_Service {
    async getCurrentUser() {
        let response = await axios.get(API_URL + '/user');
        return response
        //     return axios.get(API_URL +'/user').then((response)=>{
        //         return response.data;
        //     })
    }

    async checkTokenStatus() {
        const token = sessionStorage.getItem('patoken');
        if(token == null){
            return false
        }

        try {
            const response = await this.getCurrentUser();
            console.log("Checking token status: ",response.status)
        } catch(err){
            console.log(err);
            sessionStorage.removeItem('patoken')
            return false;
        }

    }
}
export default new API_Service;