<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1>Onboarding</h1>
        <textarea v-model="ghnames" name="gh-handles" id="handlestext" cols="30" rows="10"></textarea>
      </div>
      <div class="col-12">
        <button @click="parseNames" class="btn btn-primary">
          <div v-if="loading">
            <span class="spinner-border spinner-border-sm"></span>
            Loading...
          </div>
          <div v-else>Suchen</div>
        </button>
      </div>
      <div class="col">
        <UserList :loading="loading" :users="users" />
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

export default {
  data() {
    return {
      ghnames: '',
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
    parseNames() {
      this.loading = true
      this.users = []
      let str = this.ghnames
      let names = str.split(/\r?\n/)
      let promises = []

      names = names
        .map((name) => name.trim())
        .filter((name) => {
          return name != null && name != ''
        }) //trimming names and deleting empty names
      names.forEach((name) => {
        promises.push(
          API_Service.getUser(name)
            .then((response) => {
              this.users.push(response.data)
            })
            .catch((error) => {
              console.log('User not found: ', error)
            })
        )
      })
      Promise.all(promises).then(() => {
        console.log('Loading users finished!')
        this.loading = false
      })
    },
    inviteUsers() {
      this.users.forEach((user) => {
        API_Service.inviteUser(this.selected, user.id).then((response) => {
          console.log(response)
        })
      })
    }
  }
}
</script>

<style>
</style>