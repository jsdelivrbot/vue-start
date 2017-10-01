<template>
  <div id="login">
    <!--<img src="./assets/logo.png">-->
    <div class="mini-login-form" v-show="!loginHash">
      <input type="text" v-model="loginName">
      <input type="text" v-model="loginPassword">
      <button v-on:click="e=>login(loginName, loginPassword)">LOGIN</button>
    </div>
    
    <div v-show="!!loginHash">
      <span v-model="loginHash">{{loginHash}}</span>
      <button v-on:click="e=>logout()">LOGOUT</button>
    </div>
  
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        loginName: '',
        loginPassword: '',
        loginHash: undefined
      }
    },
    methods: {
      login: function (loginName, loginPassword) {
        console.log("login", loginName, loginPassword);
        let options = {
          method: 'post',
          url: 'http://127.0.0.1:3000/login',
          headers: {
            auth: this.loginHash
          },
          body: {name: loginName, pass: loginPassword}
        };
        
        
        this
          .$http(options, {name: loginName, pass: loginPassword})
          .then(
            response => {
              // get body
              console.log(response.body);
              this.loginHash = response.body.hash ? response.body.hash : this.loginHash;
              this.$bus.$emit('hash',this.loginHash);
              console.log('hash sent');
  
            },
            error => {
              console.warn(error)
            })
          .catch(error => console.warn(error));
      },
      logout: function () {
        this.loginHash = undefined;
        this.$bus.$emit('hash',this.loginHash);
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
