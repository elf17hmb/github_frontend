<template>
  <header>
    <nav class="navbar navbar-expand-sm navbar-light bg-light w-100">
      <div class="container-fluid">
        <router-link :to="{ name: 'Home' }" class="navbar-brand">GitHub-Tool</router-link>
        <div class="navbar-text">
          <span >Eingeloggt als:</span>
          <img :src="avatar_url" width="40" height="40" class="ms-2 me-2" />
          <span>{{ login }}</span>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      avatar_url: '',
      login: ''
    }
  },
  mounted() {
    this.avatar_url = sessionStorage.getItem('avatar_url')
    this.login = sessionStorage.getItem('login')
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>