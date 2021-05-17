<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <UserList @submitNames="parseNames" :users="users" />
      </div>
      <div class="col-12 mt-3">
        <h3>Gefundene Nutzer in die Organisation einladen</h3>
      </div>
      <div class="row mt-3">
        <div class="col-8">
          <select name="" id="" class="form-select" v-model="selected">
            <option disabled selected value="">Organisation auswählen</option>
            <option v-for="org in orgs" v-bind:key="org.id" v-bind:value="org.login">
              {{ org.login }}
            </option>
          </select>
        </div>
        <div class="col">
          <button @click="inviteUsers" class="btn btn-primary">Einladen</button>
        </div>
      </div>
      <!-- <span>Selected: {{selected}}</span> -->
    </div>
  </div>
</template>

<script>
import API_Service from '../services/API'
import User_List from '../components/User_List.vue'
import toast from '../services/toast'

export default {
  data() {
    return {
      users: [],
      loading: false,
      orgs: [],
      selected: ''
    }
  },

  components: {
    UserList: User_List
  },

  mounted() {
    API_Service.getUserOrgs().then((response) => {
      this.orgs = response.data
    })
  },

  methods: {
    inviteUsers() {
      this.users.forEach((user) => {
        API_Service.inviteUser(this.selected, user.id)
          .then((response) => {
            toast.apiSuccess(response, user.login + ' was invited')
          })
          .catch((error) => {
            toast.error(user.login + ' was not invited! \n Status: ' + error.response.status)
          })
      })
    },
    lookUpUsers(names) {
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
    parseNames(ghnames) {
      this.loading = true
      //   this.users = []
      let str = ghnames
      let names = str.split(/\r?\n/)
      names = names //trimming names and deleting empty names
        .map((name) => name.trim())
        .filter((name) => {
          return name != null && name != ''
        })
      if (this.users) {
        //filtering out duplicates
        names = names.filter((name) => {
          return !this.users.some((user) => user.login === name)
        })
      }

      this.lookUpUsers(names)
    }
  }
}
</script>

<style>
</style>