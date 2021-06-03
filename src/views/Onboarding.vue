<template>
  <div class="container">
    <div class="row g-3">
      <div class="col">
        <UserList @submitNames="lookUpUsers" @deleteUser="deleteUser" :users="users" />
      </div>
      <div class="col-12 mt-3">
        <h3>Invite found Users to an organization:</h3>
      </div>
      <div class="col-6 text-start">
        <label for="organizations" class="small">Organizations:</label>
        <select name="" id="" class="form-select" v-model="selected" @change="emptyTeams" aria-label="organizations">
          <option disabled selected value="">Organisation auswählen</option>
          <option v-for="org in orgs" v-bind:key="org.id" v-bind:value="org.login">
            {{ org.login }}
          </option>
        </select>
      </div>
      <div class="col-6 d-flex justify-content-center align-items-center">
        <div class="form-check form-switch ">
          <input class="form-check-input" type="checkbox" id="inviteToTeamSwitch" v-model="isTeamInviteActive" @change="emptyTeams"/>
          <label for="inviteToTeamSwitch" class="form-check-label"> Invite into teams</label>
        </div>
      </div>

      <div class="col-12" v-if="isTeamInviteActive && selected">
        <div class="rounded border">
          <ul class="list-group">
            <li class="list-group-item" v-for="(team, index) in teams" :key="team.id" :value="index">
              <div class="row">
                <div class="col-8 text-start">{{ team.slug }}</div>
                <div class="col text-end">
                  <button class="btn-close small" @click="deleteTeam(index)" aria-label="remove this team"></button>
                </div>
              </div>
            </li>
            <li class="list-group-item">
              <button class="btn btn-outline-primary w-100" data-bs-toggle="modal" :data-bs-target="'#' + modalId">+</button>
            </li>
          </ul>
        </div>
        <InputModal @submitNames="lookUpTeams" :modalId="modalId" :heading="'Team-Namen eingeben'" />
      </div>

      <div class="col">
        <button @click="inviteUsers" class="btn btn-primary">Invite</button>
      </div>

      <!-- For testing purposes: -->
      <!-- <div class="col-12">
        <button class="btn btn-primary" @click="getAllTeams"> GET ALL TEAMS</button>
      </div> -->
    </div>
  </div>
</template>

<script>
import API_Service from '../services/API'
import UserList from '../components/User_List.vue'
import toast from '../services/toast'
import InputModal from '../components/Input_Modal'

export default {
  data() {
    return {
      users: [],
      loading: false,
      orgs: [],
      selected: '',
      isTeamInviteActive: false,
      teams: [],
      modalId: 'teamNamesModal'
    }
  },

  props:{
    selectOrgName:{
      type:String,
    },
  },

  components: {
    UserList,
    InputModal
  },

  mounted() {
    API_Service.getUserOrgs().then((response) => {
      this.orgs = response.data
    })
    if(this.selectOrgName && this.selectOrgName != ''){
      this.selected = this.selectOrgName
    }
  },

  methods: {
    inviteUsers() {
      let team_ids = []
      if (this.teams) {
        this.teams.forEach((team) => {
          console.log('inviting with teams: ' + team.id)
          console.log(team)
          team_ids.push(team.id)
        })
      }
      this.users.forEach((user) => {
        API_Service.inviteUser(this.selected, user.id, team_ids)
          .then((response) => {
            toast.apiSuccess(response, user.login + ' was invited')
          })
          .catch((error) => {
            toast.error(user.login + ' was not invited! \n Status: ' + error.response.status)
          })
      })
    },

    parseNames(stringOfNames, arrayToPopulate) {
      this.loading = true
      let str = stringOfNames
      let names = str.split(/\r?\n/)
      names = names //trimming names and deleting empty names
        .map((name) => name.trim())
        .filter((name) => {
          return name != null && name != ''
        })
      if (arrayToPopulate) {
        //filtering out duplicates
        names = names.filter((name) => {
          return !arrayToPopulate.some((user) => user.login === name)
        })
      }
      return names
    },

    lookUpUsers(ghnames) {
      const names = this.parseNames(ghnames, this.users)

      let promises = []
      names.forEach((name) => {
        promises.push(
          API_Service.getUser(name, false)
            .then((response) => {
              this.users.push(response.data)
            })
            .catch((error) => {
              toast.error(name + ' was not found! Status: ' + error.response.status)
            })
        )
      })
      Promise.all(promises).then(() => {
        console.log('Loading users finished!')
        this.loading = false
      })
    },

    lookUpTeams(teamNames) {
      if (this.selected && this.isTeamInviteActive) {
        const names = this.parseNames(teamNames, this.teams)
        let promises = []

        names.forEach((name) => {
          promises.push(
            API_Service.getTeam(this.selected, name, false)
              .then((response) => {
                this.teams.push(response.data)
              })
              .catch((error) => {
                toast.error('Team ' + name + ' was no found! Status: ' + error.response.status)
              })
          )
        })

        Promise.all(promises).then(() => {
          console.log('Loading teams finished!')
        })
      }
    },

    deleteTeam(index) {
      this.teams.splice(index, 1)
    },
    deleteUser(index) {
      this.users.splice(index, 1)
    },
    emptyTeams(){
      this.teams.length = 0
    },
    // async getAllTeams(){
    //   const lastPagePrefix = '&page='
    //   const lastPageStringPartTwo = '>; rel="last"'

    //   const firstRequest =  await API_Service.listTeams(this.selected)
    //   console.log("GETTING TEAMS: ")
    //   console.log(firstRequest)
    //   const headerLinkPagination = firstRequest.headers.link.toString()
    //   const lastPage = headerLinkPagination.substr(headerLinkPagination.lastIndexOf(lastPagePrefix) + lastPagePrefix.length, headerLinkPagination.lastIndexOf(lastPageStringPartTwo))
    //   console.log("LAST PAGE NUMBER: " + lastPage);
    // }
  }
}
</script>

<style>
</style>