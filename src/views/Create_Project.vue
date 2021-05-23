<template>
  <div class="container h-100">
    <h3 class="text-start">Org: {{ orgName }}</h3>
    <div class="row">
      <div class="col text-start">
        <label for="vorschau">Vorschau Teams:</label>
      </div>
      <div id="vorschau" class="row round border">
        <div class="col mt-2 mb-2">
          <button class="btn btn-primary">+ Hinzufügen</button>
        </div>
        <div class="col mt-2 mb-2">
          <button class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#' + modalId">Teams eingeben</button>
        </div>

        <div class="col-12">
          <ul class="list-group">
            <li class="list-group-item" v-for="(team, teamIndex) in teams" :key="teamIndex" :value="teamIndex">
              <div class="row">
                <div class="col-8 text-start">
                  <h5>Team {{teamIndex + 1}}</h5> </div>
                <div class="col text-end">
                  <!-- <button class="btn-close small" @click="deleteTeam(index)" aria-label="remove this team"></button> -->
                </div>
                <label for="memberlist" class="text-start">Mitglieder:</label>
                <ul id="memberlist" class="list-group">
                  <li class="list-group-item" v-for="(user,uIndex) in team" :key="uIndex">
                    <span>{{user}}</span>
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
      let teams = teamString.split(/\r?\n/)
      teams = teams
        .filter((team) => {
          return team.trim() != ''
        })
        .map((team) => {
          return team.trim().split(',')
        })
      console.log('TEAMS length: ' + teams.length)
      console.log(teams)
      return teams
    },

    createTeamPreviews(teamString){
      this.teams = this.parseTeamInput(teamString)

    }
  }
}
</script>

<style>
</style>