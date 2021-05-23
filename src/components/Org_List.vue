<template>
  <div class="container-fluid row gy-3">
    <div class="">
      <div v-if="loading">loading...</div>

      <ul v-else class="list-group">
        <li class="list-group-item" v-for="org in orgs" v-bind:key="org.id">
          <div class="row">
            <div class="col text-start">
              <img v-bind:src="org.avatar_url" width="40" height="40" class="img-fluid rounded float-start me-3" style="max-width: 18rem" />
              <span>{{ org.login }}</span>
            </div>
            <div class="col text-end">
              <div class="d-grid gap-2 d-flex justify-content-end">
                <button class="btn btn-outline-secondary btn-sm" @click="goToCreateProject(org.login)">Projekt erstellen</button>
                <button class="btn btn-outline-primary btn-sm" @click="goToOnboarding(org.login)"><span>+ Onboarding</span></button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import API_Service from '../services/API'
export default {
  name: 'OrgList',
  data: function () {
    return {
      orgs: [],
      loading: true
    }
  },

  mounted() {
    API_Service.getUserOrgs()
      .then((response) => {
        this.orgs = response.data
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    goToOnboarding(orgName) {
      console.log('GO TO ONBOARDING WITH ORG: ' + orgName)
      this.$router.push({ name: 'Onboarding', params: { selectOrgName: orgName } })
    },
    goToCreateProject(orgName) {
      this.$router.push({ name: 'CreateProject', params: { orgName: orgName } })
    }
  }
}
</script>

<style scoped>
</style>