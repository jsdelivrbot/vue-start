<template>
  <div id="login">
    <!--<img src="./assets/logo.png">-->
    <input type="text" v-model="loginName">
    <input type="text" v-model="loginPassword">
    <button v-on:click="e=>login(loginName, loginPassword)">LOGIN</button>
  
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        loginName: '',
        loginPassword: ''
      }
    },
    methods: {
      login: function (loginName, loginPassword) {
        console.log("login", loginName, loginPassword);
        let options = {
          method: 'post',
          url: 'http://127.0.0.1:3000/login',
          headers: {
            Authorization: "Basic " + btoa(loginName + ":" + loginPassword)
          }
        };
        console.log(options);
        
        
        this
          .$http(options, {name: loginName, pass: loginPassword})
          .then(response => {
            // get status
            console.log(response.status);
            // get status text
            console.log(response.statusText);
            // get 'Expires' header
            response.headers.get('Expires');
            // get body data
            this.someData = response.body;
          }, response => {
            // error callback
          })
          .catch(error => console.log(error));
      }
    }
    
  }
</script>

<style>
  #login {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
