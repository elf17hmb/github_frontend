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
        <ul class="list-group">
          <li class="list-group-item" v-for="(team, teamIndex) in teams" :key="teamIndex" :value="teamIndex">
            <div class="row">
              <div class="col-8 text-start">
                <h5>{{ teamNamePrefix + team.name }}</h5>
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
                      <button class="btn-close small" @click="deleteMemberInTeam(uIndex, teamIndex)" aria-label="remove this team"></button>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <button class="btn btn-outline-secondary w-100" data-bs-toggle="modal" :data-bs-target="'#' + memberInputModalId + teamIndex">+</button>
                </li>
              </ul>
              <label for="repolist" class="mt-2 mb-2 text-start">Repositories:</label>
              <ul id="reporist" class="list-group">
                <li class="list-group-item" v-for="(repo, repoIndex) in teams[teamIndex].repos" :key="repoIndex">
                  <div class="row">
                    <div class="col text-start">
                      <span>{{ teamNamePrefix + repo.name }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <InputModal @submitNames="createMemberPreviews(teamIndex, $event)" :modalId="memberInputModalId + teamIndex" :heading="'GH-Namen eingeben'" />
          </li>
          <li class="list-group-item p-1">
            <button class="btn btn-outline-primary w-100" data-bs-toggle="modal" :data-bs-target="'#' + teamInputModalId">+</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <InputModal @submitNames="createTeamPreviews" :modalId="teamInputModalId" :heading="'Teams eingeben'" />
</template>

<script>
import API_Service from '../services/API'
import InputModal from '../components/Input_Modal'
export default {
  data() {
    return {
      teamInputModalId: 'teamInputModal',
      memberInputModalId: 'memberInputModal',
      teams: [],
      parentTeamString: '',
      parentTeam: null,
      generateRepos: true,
      teamNamePrefix: ''
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
          const teamName = 'gruppe-' + this.teams.length

          this.teams.push({
            name: teamName,
            members: team,
            repos: this.generateRepos ? [{ name: teamName + '-repo' }] : []
          })
        })
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
      })
    },

    removeParentTeam() {
      this.parentTeam = null
      this.teamNamePrefix = ''
    },

    deleteTeam(index) {
      this.teams.splice(index, 1)
    },

    deleteMemberInTeam(uIndex, teamIndex) {
      this.teams[teamIndex].members.splice(uIndex, 1)
    },
  }
}
</script>

<style>
</style>