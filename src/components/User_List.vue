<template>
    <div class="border  mt-5">
        <div class="row m-2 gy-3 gx-5">
            <div v-if="loading">
            <span class="spinner-border spinner-border-sm"></span>
            Loading...
            </div>
            <div v-else v-for="user in users" v-bind:key="user.id" class="col-6 ">
                <div class="row rounded border">
                    <div class="col">
                        <img id="pfp" v-bind:src="user.avatar_url" class=" rounded-circle rounded float-start"/>
                    </div>
                    <div class="col text-start">
                        <span>{{user.login}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    loading: {
        type: Boolean,
        default: true,
    },
    users: Array,
  },
};
</script>

<style scoped>
#pfp{
    width: 5rem;
}
</style>