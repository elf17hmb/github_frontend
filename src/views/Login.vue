<template>
  <div class="container h-100 d-flex justify-content-center align-items-center">
      <div class="card shadow-lg rcorners">
        <div class="text-center p-3">
        <img alt="GitHub logo" class="h-30 " src="../assets/gh-logo.png">
        </div>
        <div class="card-body">
          <div class="card-title text-center mt-3" style="width:18rem;">
            <h5>GitHub Frontend</h5>
          </div>
          <p class="mt-5">
            <input type="text" class="rounded-pill" v-model="patoken">
          </p>
          <button @click="persist" class="btn btn-primary rounded-pill">Sign in via GitHub</button>
        </div>
      </div>
  </div>
</template>

<script>
import API_Service from '../services/API'
export default {

  data (){
    return{
      patoken:''
    }
  },

  methods: {
    persist(){
      sessionStorage.patoken = this.patoken;
      API_Service.getCurrentUser().then(response => {
        console.log("GET USER RESPONSE: ", response.data)
      })
      this.$router.push('')
    }
  }

}
</script>

<style scoped>
.rcorners{
  border-radius: 25px;
}
</style>