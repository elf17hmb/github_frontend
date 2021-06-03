<template>
  <div class="container h-100">
    <h3 class="text-start">Org: {{ orgName }}</h3>
    <div class="text-start">
      <label for="vorschau">Vorschau Teams:</label>
    </div>
    <div id="preview" class="row round border">
      <!-- <div class="col mt-2 mb-2">
          <button class="btn btn-primary">+ Hinzufügen</button>
        </div>
        <div class="col mt-2 mb-2">
          <button class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#' + modalId">Teams eingeben</button>
        </div> -->
      <div id="paren_team_input" class="col mb-3 mt-3">
        <div class="row">
          <div class="col-auto text-start">
            <label class="form-label">Übergeordnetes Team:</label>
            <input id="parentTeam" v-model="parentTeamString" v-if="!parentTeam" type="text" class="form-control" placeholder="team_slug  (optional)" />
            <a v-else :href="parentTeam.html_url" target="_blank" class="btn btn-light w-100 text-start">{{ parentTeam.slug }}</a>
          </div>
          <div class="col-auto d-flex align-items-end">
            <button v-if="parentTeam === null" class="btn btn-outline-primary" @click="lookUpParentTeam(parentTeamString)">Suchen</button>
            <button v-else class="btn btn-close" @click="removeParentTeam"></button>
          </div>
          <div class="col-auto">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="inviteToTeamSwitch" v-model="generateRepos" />
              <label for="inviteToTeamSwitch" class="form-check-label"> Repositories anlegen</label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <ul id="teamsList" class="list-group">
          <li
            class="list-group-item text-start border-2"
            :class="{ 'status-success': team.isNameAvailable, 'status-warning': !team.isNameAvailable }"
            v-for="(team, teamIndex) in teams"
            :key="teamIndex"
            :value="teamIndex"
          >
            <div class="row">
              <div class="col-12 d-flex w-100 justify-content-between">
                <h5>{{ teamNamePrefix + team.name }}</h5>
                <span v-if="!team.isNameAvailable" class="text-danger">schon vorhanden</span>
                <button class="btn-close small" @click="deleteTeam(teamIndex)" aria-label="remove this team"></button>
              </div>
              <div class="col-12 col-md-6">
                <label for="memberlist" class="text-start">Mitglieder:</label>
                <ul id="memberlist" class="list-group">
                  <li class="list-group-item" v-for="(user, uIndex) in team.members" :key="uIndex">
                    <div class="row">
                      <div class="col text-start">
                        <span>{{ user }}</span>
                      </div>
                      <div class="col text-end">
                        <button class="btn-close small" @click="deleteMemberInTeam(uIndex, teamIndex)" aria-label="remove this member"></button>
                      </div>
                    </div>
                  </li>
                  <li class="list-group-item">
                    <button class="btn btn-outline-secondary w-100" data-bs-toggle="modal" :data-bs-target="'#' + memberInputModalId + teamIndex">+</button>
                  </li>
                </ul>
              </div>
              <div class="col-12 col-md-6 mt-2 mt-md-0">
                <label for="repolist" class="text-start">Repositories:</label>
                <ul id="reporist" class="list-group">
                  <li class="list-group-item" v-for="(repo, repoIndex) in teams[teamIndex].repos" :key="repoIndex">
                    <div class="row">
                      <div class="col text-start">
                        <span>{{ teamNamePrefix + repo.name }}</span>
                      </div>
                      <div class="col text-end">
                        <button class="btn-close small" @click="deleteRepoInTeam(repoIndex, teamIndex)" aria-label="remove this repo"></button>
                      </div>
                      <div class="col-12 d-flex flex-wrap">
                        <div v-for="(topic, topicIndex) in teams[teamIndex].topics" :key="topicIndex" class="badge rounded-pill bg-light text-dark">
                          <span>{{ topic }}</span>
                          <button class="btn-close small" @click="deleteTopicInTeam(topicIndex, teamIndex)" aria-label="remove this topic"></button>
                        </div>
                        <button data-bs-toggle="collapse" :data-bs-target="'#collapse-' + teamIndex" class="badge btn btn-light rounded-pill text-dark">+</button>
                      </div>
                    </div>
                  </li>
                  <li id="addRepo" class="list-group-item">
                    <button class="btn btn-outline-secondary w-100" @click="addRepoPreview(teamIndex)">+</button>
                  </li>
                </ul>
              </div>
              <div class="text-center">
                <InputModal @submitNames="createMemberPreviews(teamIndex, $event)" :modalId="memberInputModalId + teamIndex" :heading="'GH-Namen eingeben'" />
              </div>
              <div :id="'collapse-' + teamIndex" class="col collapse mt-1">
                <label for="topic_input">Topics hinzufügen:</label>
                <input :id="'topic_input_' + teamIndex" type="text" v-model="team.topicInput" class="form-control" @input="addTopicsToTeam(teamIndex)" />
              </div>
            </div>
          </li>
          <li class="list-group-item p-1">
            <button class="btn btn-outline-primary w-100" data-bs-toggle="modal" :data-bs-target="'#' + teamInputModalId">+</button>
          </li>
        </ul>
      </div>
      <div class="mt-2"><button class="btn btn-primary" @click="createTeams">Teams erstellen</button></div>
    </div>
  </div>
  <InputModal @submitNames="createTeamPreviews" :modalId="teamInputModalId" :heading="'Teams eingeben'" />
</template>

<script>
import API_Service from '../services/API'
import InputModal from '../components/Input_Modal'
import toast from '../services/toast'

export default {
  data() {
    return {
      teamInputModalId: 'teamInputModal',
      memberInputModalId: 'memberInputModal',
      teams: [],
      parentTeamString: '',
      parentTeam: null,
      generateRepos: true,
      teamNamePrefix: '',
      createdTeams: [],
    }
  },
  props: {
    orgName: String
  },
  components: {
    InputModal
  },
  methods: {
    // async createTestTeams() {
    //   console.log('CREATE TEAMS!')
    //   const startingYear = 2018
    //   const amountOfTeams = 20
    //   const org = 'whz-informatik-projekt-ba-fluegel'
    //   for (let i = 0; i < amountOfTeams; i++) {
    //     const upperTeamName = '' + (startingYear - i)
    //     const response = await API_Service.createTeam(upperTeamName, org)
    //     console.log(response)
    //     for (let j = 0; j < 2; j++) {
    //       const middleTeamName = upperTeamName + '-PV' + (j + 1)
    //       const middleResponse = await API_Service.createTeam(middleTeamName, org, response.data.id)
    //       for (let k = 0; k < 5; k++) {
    //         const lowerTeamName = middleTeamName + '-Gruppe ' + (k + 1)
    //         await API_Service.createTeam(lowerTeamName, org, middleResponse.data.id)
    //       }
    //     }
    //   }
    // },

    parseTeamInput(teamString) {
      // console.log('TEAM NAMES: ' + teamNames)
      let teamsArray = teamString.split(/\r?\n/) //Splitting up the String by line breaks: amount of lines = length of array
      teamsArray = teamsArray
        .filter((team) => {
          return team.trim() != ''
        })
        .map((team) => {
          let teamObj = {}
          let trimmedTeam = team.trim()
          const trimmedTeamName = trimmedTeam.substr(0, trimmedTeam.indexOf(':')).trim()
          teamObj.name = trimmedTeamName.replace(' ', '-')
          let members = trimmedTeam.substr(trimmedTeam.indexOf(':') + 1, trimmedTeam.length)
          teamObj.members = members
            .split(',')
            .filter((member) => {
              return member.trim() != ''
            })
            .map((member) => {
              return member.trim()
            })
          return teamObj
        })
      console.log('TEAMS length: ' + teamsArray.length)
      console.log(teamsArray)
      return teamsArray
    },

    parseMemberInput(membersString) {
      let names = membersString.split(/\r?\n/)
      names = names //trimming names and deleting empty names
        .map((name) => name.trim())
        .filter((name) => {
          return name != null && name != ''
        })
      if (this.teams) {
        //filtering out duplicates
        names = names.filter((name) => {
          return !this.teams.some((team) => team.members.some((user) => user === name))
        })
      }
      return names
    },

    createTeamPreviews(teamString) {
      const teamsArray = this.parseTeamInput(teamString)
      // let teamNamePrefix = ''
      // if(this.parentTeam){
      //   teamNamePrefix = this.parentTeam.slug + '-'
      // }
      // if (this.generateRepos) {
      teamsArray.forEach((team) => {
        let teamName = ''
        if (team.name) {
          teamName = team.name
        } else {
          teamName = 'gruppe-' + this.teams.length
        }

        this.teams.push({
          name: teamName,
          members: team.members,
          repos: this.generateRepos ? [{ name: teamName + '-repo-' + 0 }] : []
        })
      })
      this.checkTeamNames()
    },

    createMemberPreviews(teamIndex, membersString) {
      const memberNames = this.parseMemberInput(membersString)
      memberNames.forEach((name) => {
        this.teams[teamIndex].members.push(name)
      })
    },

    lookUpParentTeam(team_slug) {
      API_Service.getTeam(this.orgName, team_slug).then((response) => {
        console.log('Got parent team: ', response)
        this.parentTeam = response.data
        this.teamNamePrefix = this.parentTeam.slug + '-'

        this.checkTeamNames()
      })
    },

    removeParentTeam() {
      this.parentTeam = null
      this.teamNamePrefix = ''
      this.checkTeamNames()
    },

    deleteTeam(index) {
      this.teams.splice(index, 1)
    },

    deleteMemberInTeam(uIndex, teamIndex) {
      this.teams[teamIndex].members.splice(uIndex, 1)
    },

    deleteRepoInTeam(repoIndex, teamIndex) {
      this.teams[teamIndex].repos.splice(repoIndex, 1)
    },
    addRepoPreview(teamIndex) {
      let repoName = this.teams[teamIndex].name + '-repo-' + this.teams[teamIndex].repos.length
      const timestamp = new Date().getUTCMilliseconds() //Temporary solution
      if (this.teams[teamIndex].repos.some((repo) => repo.name === repoName)) {
        repoName = repoName + '-' + timestamp
      }
      this.teams[teamIndex].repos.push({ name: repoName })
    },
    createTeams() {
      if (this.teams.length === 0) {
        toast.error('Es gibt keine Teams')
        return
      }
      if (!this.orgName || this.orgName === '' || this.orgName.trim() === '') {
        toast.error('Keine Organisation angegeben')
        return
      }
      console.log('---Creating teams...---')
      this.teams.forEach(async (team) => {
        let fullTeamName = this.teamNamePrefix + team.name
        const teamCreateResponse = await API_Service.createTeam(fullTeamName, this.orgName, this.parentTeam?.id)
        const createdTeam = teamCreateResponse.data
        // this.createdTeams.push(createdTeam)
        team.id = createdTeam.id
        toast.apiSuccess(teamCreateResponse, 'Team: ' + teamCreateResponse.data.name + ' angelegt!')

        team.members.forEach(async (member) => {
          const updateMembershipResponse = await API_Service.updateTeamMembership(this.orgName, createdTeam.slug, member, 'member')
          console.log('updateMembershipResponse: ', updateMembershipResponse)
          toast.apiSuccess(updateMembershipResponse, 'Nutzer: ' + member + ' wurde in das Team: ' + teamCreateResponse.data.name + ' eingeladen!')
        })

        team.repos.forEach(async (repo) => {
          const fullRepoName = this.teamNamePrefix + repo.name
          const repoCreateResponse = await API_Service.createRepo(this.orgName, fullRepoName, team.id)
          toast.apiSuccess(repoCreateResponse, 'Repository: ' + repoCreateResponse.data.name + ' wurde angelegt!')
          console.log('Created repo: ', repoCreateResponse.data)
          if (team.topics && team.topics.length > 0) {
            const topicAddResponse = await API_Service.replaceAllRepositoryTopics(this.orgName, fullRepoName, team.topics)
            console.log('Topics hinzugefügt: ', topicAddResponse)
          }
        })
      })
    },

    checkTeamNames() {
      this.teams.forEach((team) => {
        const fullTeamName = this.teamNamePrefix + team.name
        API_Service.getTeam(this.orgName, fullTeamName, false)
          .then((response) => {
            console.log('Team with the name:' + fullTeamName + ' was found! Response: ', response)
            team.isNameAvailable = false
            // return false
          })
          .catch((error) => {
            console.log('The name: ' + fullTeamName + ' for a team is available! The (expected) Error:', error)
            team.isNameAvailable = true
            // return true
          })
      })
      this.updateRepoTopics()
    },

    updateRepoTopics() {
      this.teams.forEach((team) => {
        const fullTeamName = this.teamNamePrefix
        const topics = fullTeamName.split('-').filter((string) => {
          return string.trim() != ''
        })
        team.topics = topics
        console.log('Team: ' + team.name + " it's topics: ", team.topics)
      })
    },

    deleteTopicInTeam(topicIndex, teamIndex) {
      this.teams[teamIndex].topics.splice(topicIndex, 1)
    },

    addTopicsToTeam(teamIndex) {
      console.log('add topics to team: ' + teamIndex + ' string: ' + this.teams[teamIndex].topicInput)
      let topicsString = this.teams[teamIndex].topicInput
      if(topicsString.includes(',')){
        let topicsArray = topicsString.split(',')
                                      .filter(topic=>{
                                        return topic.trim() != ''
                                      })
                                      .map(topic => {
                                        return topic.trim()
                                      })
        let topicsOfCurrentTeam = this.teams[teamIndex].topics
        topicsArray = topicsArray.filter(topic => {
          return topicsOfCurrentTeam.indexOf(topic) < 0
        })
        this.teams[teamIndex].topics = topicsOfCurrentTeam.concat(topicsArray)
        this.teams[teamIndex].topicInput = ''
      }
    }
  }
}
</script>

<style scoped>
.status-success {
  background: rgba(164, 212, 108, 0.5);
  border-color: green;
}

.status-warning {
  background: rgba(250, 131, 33, 0.5);
  border-color: rgb(128, 62, 0);
}
</style>