<template>
  <div class="border mt-5">
    <div class="row m-2 gy-3 gx-5">
      <div v-if="loading">
        <span class="spinner-border spinner-border-sm"></span>
        Loading...
      </div>
      <div v-else v-for="user in users" v-bind:key="user.id" class="col-6">
        <div class="row rounded border">
          <div class="col">
            <img id="pfp" v-bind:src="user.avatar_url" class="img-fluid rounded-circle rounded float-start" />
          </div>
          <div class="col text-start">
            <span>{{ user.login }}</span>
          </div>
        </div>
      </div>
      <div class="col">
        <button class="btn btn-light h-100 w-100" data-bs-toggle="modal" data-bs-target="#onboardingModal">
          <h1 class="align-self-center">+</h1>
        </button>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="onboardingModal" tabindex="-1" aria-labelledby="onboardingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1>Onboarding</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <textarea v-model="ghnames" name="gh-handles" id="handlestext" cols="30" rows="10"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="submitNames" class="btn btn-primary" data-bs-dismiss="modal">
            <div v-if="loading">
              <span class="spinner-border spinner-border-sm"></span>
              Loading...
            </div>
            <div v-else>Suchen</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['submitNames'],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    users: Array
  },
  data() {
    return {
      ghnames: ''
    }
  },
  methods: {
    submitNames() {
      this.$emit('submitNames', this.ghnames)
      this.ghnames = ''
    }
  }
}
</script>

<style scoped>
#pfp {
  width: 4rem;
}
</style>