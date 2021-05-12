<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <OrgList/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import OrgList from '../components/Org_List.vue'
export default {
  name: 'Home',
  data: function () {
    return {
      orgs: [],
    }
  },
  components: {
    OrgList,
    // HelloWorld
  }
}
</script>
<style scoped>
.home{
  height:100%;
}
</style>
