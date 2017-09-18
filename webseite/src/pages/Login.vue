<template lang="pug">
div(id="Login")
    div(id="loginPrompt")
        input(placeholder="Name" v-model="userName")
        div(id="save" @click="triggerEvent") save 

</template>

<script>


export default {

    name: 'login',

    data: function () {
        return {
            userName: undefined
        }
    },

    methods: {
        triggerEvent: function () {
            localStorage.setItem('userName', this.userName);
            this.$emit('userName');
        }
    }
}
</script>

<style lang="sass">
#Login
    > #loginPrompt
        width: 100%
        padding: 10px
        > input 
            width: 100%
        > #save
            width: 100%
            text-align: center
</style>
