<template>
  <div class="h-100 d-flex justify-content-center align-items-center loginbg">
    <div class="card shadow-lg rcorners">
      <div class="text-center p-3">
        <img alt="GitHub logo" class="h-30" src="../assets/gh-logo.png" />
      </div>
      <div class="card-body">
        <div class="card-title text-center mt-3" style="max-width: 18rem">
          <h5>GitHub Frontend</h5>
        </div>
        <p class="mt-5">
          <input type="text" class="rounded-pill" v-model="patoken" />
        </p>
        <button @click="persist" class="btn btn-primary rounded-pill">Sign in via GitHub</button>
        <p><a href="https://github.com/settings/tokens" class="small">https://github.com/settings/tokens</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router'
import API_Service from '../services/API'
export default {
  data() {
    return {
      patoken: ''
    }
  },

  methods: {
    async persist() {
      try {
        sessionStorage.patoken = this.patoken
        const response = await API_Service.getCurrentUser()
        console.log(response)
        router.push({ name: 'Home' })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
.loginbg {
  background-color: rgb(0, 59, 111);
}
.rcorners {
  border-radius: 25px;
}
</style>