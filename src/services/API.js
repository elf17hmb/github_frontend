import axios from 'axios'
const API_URL = 'https://api.github.com'
class API_Service {
    async getCurrentUser() {
        let response = await axios.get(API_URL + '/user');
        return response
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

    async inviteUser(orgName, userId,_team_ids) {
        let response = await axios({
            method: 'post',
            url: API_URL + '/orgs/' + orgName + '/invitations',
            data: {
                invitee_id: userId,
                team_ids:_team_ids,
            },
            handleError: false
        })
        return response
    }

    getTeam(orgName, team_slug, _handleError = true) {
        return axios
            .get(API_URL + '/orgs/' + orgName + '/teams/' + team_slug, { handleError: _handleError })
            .then(response => {
                return response
            })
    }

    async createTeam(_name, org, _parent_team_id){
        console.log("Trying to create team: " + _name +" in org: " + org  + " under Team: " + _parent_team_id)
        const response = await axios({
            method : 'post',
            url: API_URL + '/orgs/' + org + '/teams',
            data: {
                name: _name,
                parent_team_id: _parent_team_id,
                privacy: 'closed'
            },
        })
        return response
    }
}
export default new API_Service;