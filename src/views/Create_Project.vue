<template>
  <div>
    <button class="btn btn-primary" @click="createTeams">CREATE</button>
  </div>
</template>

<script>
import API_Service from '../services/API'
export default {
  methods: {
    async createTeams() {
      console.log('CREATE TEAMS!')
      const startingYear = 2018
      const amountOfTeams = 20
      const org = 'whz-informatik-projekt-ba-fluegel'
      for (let i = 0; i < amountOfTeams; i++) {
        const upperTeamName = '' + (startingYear - i)
        const response = await API_Service.createTeam(upperTeamName, org)
        console.log(response)
        for (let j = 0; j < 2; j++) {
          const middleTeamName = upperTeamName +'-PV' + (j + 1)
          const middleResponse = await API_Service.createTeam(middleTeamName, org, response.data.id)
          for (let k = 0; k < 5; k++) {
            const lowerTeamName = middleTeamName + '-Gruppe ' + (k + 1)
            await API_Service.createTeam(lowerTeamName, org, middleResponse.data.id)
          }
        }
      }
    }
  }
}
</script>

<style>
</style>