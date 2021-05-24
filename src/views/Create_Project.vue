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
            <h5 v-else>{{ parentTeam.slug }}</h5>
          </div>
          <div class="col-auto d-flex align-items-end">
            <button v-if="parentTeam === null" class="btn btn-outline-primary" @click="lookUpATeam(parentTeamString)">Suchen</button>
            <button v-else class="btn btn-close" @click="removeParentTeam"></button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <ul class="list-group">
          <li class="list-group-item" v-for="(team, teamIndex) in teams" :key="teamIndex" :value="teamIndex">
            <div class="row">
              <div class="col-8 text-start">
                <h5>{{ team.name }}</h5>
              </div>
              <div class="col text-end">
                <button class="btn-close small" @click="deleteTeam(teamIndex)" aria-label="remove this team"></button>
              </div>
              <label for="memberlist" class="text-start">Mitglieder:</label>
              <ul id="memberlist" class="list-group">
                <li class="list-group-item list-group-item-secondary" v-for="(user, uIndex) in team.members" :key="uIndex">
                  <div class="row">
                    <div class="col text-start">
                      <span>{{ user }}</span>
                    </div>
                    <div class="col text-end">
                      <button class="btn-close small" @click="deleteMemberInTeam(uIndex,teamIndex)" aria-label="remove this team"></button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li class="list-group-item">
            <button class="btn btn-outline-primary w-100" data-bs-toggle="modal" :data-bs-target="'#' + modalId">+</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <InputModal @submitNames="createTeamPreviews" :modalId="modalId" :heading="'Teams eingeben'" />
</template>

<script>
import API_Service from '../services/API'
import InputModal from '../components/Input_Modal'
export default {
  data() {
    return {
      modalId: 'teamInputModal',
      teams: [],
      parentTeamString: '',
      parentTeam: null
    }
  },
  props: {
    orgName: String
  },
  components: {
    InputModal
  },
  methods: {
    async createTestTeams() {
      console.log('CREATE TEAMS!')
      const startingYear = 2018
      const amountOfTeams = 20
      const org = 'whz-informatik-projekt-ba-fluegel'
      for (let i = 0; i < amountOfTeams; i++) {
        const upperTeamName = '' + (startingYear - i)
        const response = await API_Service.createTeam(upperTeamName, org)
        console.log(response)
        for (let j = 0; j < 2; j++) {
          const middleTeamName = upperTeamName + '-PV' + (j + 1)
          const middleResponse = await API_Service.createTeam(middleTeamName, org, response.data.id)
          for (let k = 0; k < 5; k++) {
            const lowerTeamName = middleTeamName + '-Gruppe ' + (k + 1)
            await API_Service.createTeam(lowerTeamName, org, middleResponse.data.id)
          }
        }
      }
    },

    parseTeamInput(teamString) {
      // console.log('TEAM NAMES: ' + teamNames)
      let teamsArray = teamString.split(/\r?\n/)
      teamsArray = teamsArray
        .filter((team) => {
          return team.trim() != ''
        })
        .map((team) => {
          return team.trim().split(',')
        })
      console.log('TEAMS length: ' + teamsArray.length)
      console.log(teamsArray)
      return teamsArray
    },

    createTeamPreviews(teamString) {
      const teamsArray = this.parseTeamInput(teamString)
      teamsArray.forEach((team) => {
        this.teams.push({
          name: 'Gruppe ' + this.teams.length,
          members: team
        })
      })
    },

    lookUpATeam(team_slug) {
      API_Service.getTeam(this.orgName, team_slug).then((response) => {
        this.parentTeam = response.data
      })
    },

    removeParentTeam() {
      this.parentTeam = null
    },

    deleteTeam(index) {
      this.teams.splice(index, 1)
    },

    deleteMemberInTeam(uIndex,teamIndex) {
      this.teams[teamIndex].members.splice(uIndex,1)
    }
  }
}
</script>

<style>
</style>