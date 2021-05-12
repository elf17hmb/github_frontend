<template>
  <div class="container-fluid row gy-3">
    <div v-if="loading">loading...</div>

    <div v-else v-for="org in orgs" v-bind:key="org.id" class="col-12 rounded border">
        <div>
            <img v-bind:src="org.avatar_url" class="w-50 img-thumbnail rounded float-start" style="max-width:18rem;"/>
        </div>
        <div>
            <h3>{{org.login}}</h3>
        </div>
    </div>
  </div>
</template>

<script>
import API_Service from '../services/API'
export default {
    name: 'OrgList',
    data: function () {
        return{
            orgs:[],
            loading:true,
        }
    },

    mounted() {
        API_Service.getUserOrgs().then(response => {
            this.orgs = response.data
        }).finally(()=> this.loading = false)
    }

}
</script>

<style scoped>

</style>