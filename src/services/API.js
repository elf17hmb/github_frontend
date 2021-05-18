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
        if (token == null) {
            return false
        }

        try {
            const response = await this.getCurrentUser();
            console.log("Checking token status: ", response.status)
        } catch (err) {
            console.log(err);
            sessionStorage.removeItem('patoken')
            return false;
        }

    }

    getUserOrgs() {
        return axios
            .get(API_URL + '/user/orgs')
            .then(response => {
                console.log('Got the orgs for the authenticated user: ', response)
                return response;
            })
            .catch(error => {
                console.log(error)
            })
    }

    getUser(username, _handleError = true) {
        return axios
            .get(API_URL + '/users/' + username, { handleError: _handleError })
            .then(response => {
                console.log('Got the searched user: ', response)
                return response
            })
    }

    async inviteUser(orgName, userId) {
        let response = await axios({
            method: 'post',
            url: API_URL + '/orgs/' + orgName + '/invitations',
            data: { invitee_id: userId },
            handleError: false
        })
        return response
    }

    getTeam(orgName, team_slug) {
        return axios
            .get(API_URL + '/orgs/' + orgName + '/teams/' + team_slug)
            .then(response => {
                return response
            })
    }
}
export default new API_Service;