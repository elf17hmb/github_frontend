<template>
  <!-- Modal -->
  <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="onboardingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 >{{heading}}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <textarea v-model="namesString" name="gh-handles" id="handlestext" cols="30" rows="10"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="submitNames" class="btn btn-primary" data-bs-dismiss="modal">

            <div >Suchen</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

    emits:['submitNames'],

    props:{
        heading : {
            type:String,
            default:'Names input'
        },
        modalId : {
            type:String,
            default:'defaultModalId'},
    },

    data () {
        return {
            namesString : '',
        }
    },

    methods : {
        submitNames () {
            this.$emit('submitNames', this.namesString)
            this.namesString = ''
        }
    }

}
</script>

<style>

</style>