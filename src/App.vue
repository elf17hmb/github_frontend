<template>
  
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <Header v-if="!$route.meta.hideNavigation"/>
  <router-view/>
</template>

<script>
import Header from './components/Header.vue'
export default {
  name:'App',

  components:{
    Header
  }

}
</script>

<style>
body, html {
  height:100%;
}
.btn-primary {
  background-color:rgb(157, 57, 46) !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;

}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
