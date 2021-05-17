<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <UserList />
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