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

    async inviteUser(orgName, userId, _team_ids) {
        let response = await axios({
            method: 'post',
            url: API_URL + '/orgs/' + orgName + '/invitations',
            data: {
                invitee_id: userId,
                team_ids: _team_ids,
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

    async createTeam(_name, org, _parent_team_id) {
        console.log("Trying to create team: " + _name + " in org: " + org + " under Team: " + _parent_team_id)
        const response = await axios({
            method: 'post',
            url: API_URL + '/orgs/' + org + '/teams',
            data: {
                name: _name,
                parent_team_id: _parent_team_id,
                privacy: 'closed'
            },
        })
        console.log("Created a team: ", response)
        return response
    }

    async listTeams(org) {
        const response = await axios({
            method: 'get',
            url: API_URL + '/orgs/' + org + '/teams',
            params: {
                per_page: 100,
            }
        })
        return response
    }

    async updateTeamMembership(org, team_slug, username, _role) {
        console.log("Trying to update team membership for: " + username + " to: " + _role)
        const response = await axios({
            method: 'put',
            url: API_URL + '/orgs/' + org + '/teams/' + team_slug + '/memberships/' + username,
            data: {
                role: _role
            }
        })
        return response
    }

    async createRepo(org, _name, _team_id) {

        console.log("Trying to create a repo: " + _name + ' in org: ' + org + ' for team: ' + _team_id)
        const response = await axios({
            method: 'post',
            url: API_URL + '/orgs/' + org + '/repos',
            data: {
                name: _name,
                private: true,
                team_id: _team_id
            }
        })
        return response

    }

    async replaceAllRepositoryTopics(owner, repo, _names) {
        console.log("Trying to replace all Repo Topics for: " + owner + "/" + repo + " with the topics: ", _names)
        const response = await axios({
            method: 'put',
            url: API_URL + '/repos/' + owner + '/' + repo + '/topics',
            data: {
                names: _names
            },
            headers: {
                Accept: 'application/vnd.github.mercy-preview+json' //<-- Topics are still in Preview for Developers
            }

        })
        return response
    }
}
export default new API_Service;