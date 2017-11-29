<template>
  <div id="login">
    <!--<img src="./assets/logo.png">-->
    
    <md-theme md-name="teal">
      <div class="mini-login-form md-layout" v-show="!loginHash">
        
        <md-input-container class="md-layout">
          <label>LOGIN</label>
          <md-textarea v-model="loginName"></md-textarea>
        </md-input-container>
        
        
        <md-input-container class="md-layout">
          <label>PASSWORD</label>
          <md-input type="password" v-model="loginPassword"></md-input>
        </md-input-container>
        
        <md-layout md-flex="25">
          <md-button
            class="md-primary "
            v-on:click="(e)=>{login(loginName, loginPassword)}"
          >
            <icon class='btn-icon' name="sign-in"></icon>
          </md-button>
        </md-layout>
      </div>
      
      
      <div v-show="!!loginHash" class="md-layout">
        <md-layout>
          <md-input-container class="">
            <label>Your Hash is:</label>
            <md-input disabled v-model="loginHash"></md-input>
          </md-input-container>
        </md-layout>
        <md-layout md-flex="25">
          <md-button
            class='md-accent '
            v-on:click="e=>logout()"
          >
            <icon class='btn-icon' name="sign-out"></icon>
          </md-button>
        </md-layout>
      </div>
    </md-theme>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
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
          url: '/login',
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
              this.$bus.$emit('hash', this.loginHash);
              console.log('hash sent');
              
            },
            error => {
              console.warn(error)
            })
          .catch(error => console.warn(error));
      },
      logout: function () {
        this.loginHash = undefined;
        this.$bus.$emit('hash', this.loginHash);
      }
    }
  }
</script>

<style>
  #login {
    position: absolute;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    bottom: 60px;
    left: 60px;
    right: 60px;
    height: calc(10% - 60px);
    width: 100%;
  }


</style>
