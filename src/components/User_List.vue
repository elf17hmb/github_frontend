<template>
  <div class="border mt-5">
    <div class="row m-2 g-3">
      <div v-if="loading">
        <span class="spinner-border spinner-border-sm"></span>
        Loading...
      </div>
      <div v-else v-for="(user, index) in users" v-bind:key="index" class="col-6 rounded border">
        <div class="row">
          <div class="col">
            <img id="pfp" v-bind:src="user.avatar_url" width="40" class="img-fluid rounded-circle rounded float-start" />
          </div>
          <div class="col text-start">
            <span>{{ user.login }}</span>
          </div>
          <div class="col-2 text-end">
            <button class="btn-close small" @click="deleteUser(index)" aria-label="remove this user"></button>
          </div>
        </div>
      </div>
      <!-- <div class="col"> -->
        <button class="btn btn-outline-secondary h-100 w-100" data-bs-toggle="modal" :data-bs-target="'#' + modalId">
          <h1 class="align-self-center">+</h1>
        </button>
      <!-- </div> -->
    </div>
  </div>
  <InputModal @submitNames="submitNames" :modalId="modalId" :heading="'GH-Namen eingeben'" />
</template>

<script>
import InputModal from '../components/Input_Modal'
export default {
  components: {
    InputModal
  },
  emits: ['submitNames', 'deleteUser'],
  data() {
    return {
      modalId: 'ghNamesModal'
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    users: Array
  },
  methods: {
    submitNames(ghnames) {
      this.$emit('submitNames', ghnames)
      this.ghnames = ''
    },
    deleteUser(index) {
      this.$emit('deleteUser', index)
    }
  }
}
</script>

<style scoped>
</style>