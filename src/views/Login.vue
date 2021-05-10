<template>
  <div class="container h-100 d-flex justify-content-center align-items-center">
      <div class="card shadow-lg rcorners">
        <div class="text-center p-3">
        <img alt="GitHub logo" class="h-30 " src="../assets/gh-logo.png">
        </div>
        <div class="card-body">
          <div class="card-title text-center mt-3" style="width:18rem;">
            <h5>GitHub Verwaltungstool für Repositories</h5>
          </div>
          <a href="https://github.com/login/oauth/authorize?client_id=31944c9de13db2f176b5" class="btn btn-primary mt-5 rounded-pill">Sign in via GitHub</a>
        </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.rcorners{
  border-radius: 25px;
}
</style>