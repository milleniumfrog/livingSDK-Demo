<template lang="pug">
div(id=App)
  login(@userName="updateUserNameAndPage" v-if="page === 'login'")
  list(v-if="page === 'list'" :pdata="data" :ploggedIn="userName") 

</template>

<script>
import login from './pages/Login';
import list from './pages/List';
import io from 'socket.io-client/dist/socket.io.slim.js';

export default {


  name: 'app',


  data: function () {
    return {
      page: 'login',
      data: undefined,
      userName: undefined
    }
  },


  components: {
    login,
    list
  },

  methods: {
    updateUserNameAndPage () {
      this.page = 'list'; 
      this.userName = localStorage.getItem('userName')
    }
  },

  
  mounted: function () {

    this.userName = localStorage.getItem('userName');
    if (this.userName && this.userName !== 'undefined') {
      this.page = 'list';
    }

    let vue = this;
    let socket = io('http://localhost:3000');
    socket.on('data', (res) => {
      vue.data = undefined;
      vue.data = res;
    })
  }


}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Source+Code+Pro')

*
  margin: 0
  padding: 0
  box-sizing: border-box
  font-family: 'Source Code Pro', monospace

#App
</style>
