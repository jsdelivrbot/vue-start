<template>
  <div class="urlShort">
    <h1>{{ msg }}</h1>
    <h2>Started at {{ date }}</h2>
    <h3 v-model="loginHash"> Current hash is  <div class="hash">{{loginHash}}</div>
    </h3>
    <br>
    <md-theme md-name="teal">
      <div>
        <md-button
          v-on:click="(e) => addUrl('currentUrl')"
          :disabled="!loginHash"
          class="md-primary"
        >
          add url
        </md-button>
      </div>
    </md-theme>
    
    
    <br>
    <input type="text" v-model="currentUrl">
    <input type="text" v-model="numberHashes">
    <div>
      
      <md-table>
        <md-table-header>
          <md-table-row>
            <md-table-head>
              Long
            </md-table-head>
            <md-table-head>
              Short
            </md-table-head>
          </md-table-row>
        </md-table-header>
        
        <md-table-body>
          <md-table-row v-for="url in urls">
            <md-table-cell v-for="field in url">
              
              <a v-bind:href="field" class="md-transparent">{{field}}</a>
            
            </md-table-cell>
          </md-table-row>
        </md-table-body>
      
      </md-table>
    
    </div>
  
  
  </div>
</template>


<script>
  export default {
//    el:'#tst',
    
    name: 'tst',
    data() {
      return {
        currentUrl: 'https://nnm.me',
        msg: 'This is a test Url Shortener',
        date: new Date().toLocaleString(),
        urls: [],
        loginHash: '',
        numberHashes: 256
      }
    },
    methods: {
      addUrl: function () {
        
        
        //curl -X POST \
        //        -d "url=https://en.wikipedia.org/wiki/Monero_(cryptocurrency)" \
        //	-d "hashes=1024" \
        //	-d "secret=<secret-key>" \
        //	"https://api.coinhive.com/link/create"
        let options = {
          method: 'post',
          url: '/urlShort',
          headers: {
            auth: this.loginHash
          },
          body: {url: this.currentUrl, hashes: this.numberHashes, hash: this.loginHash}
        };
        
        this
          .$http(options)
          .then(
            response => {
              this.urls = response.body.urls;
            },
            error => {
              console.warn(error)
            })
          .catch(error => console.warn(error));
        
        
      },
      getUrls: function () {
        let options = {
          method: 'post',
          url: '/getUrls',
          headers: {
            auth: this.loginHash
          },
          body: {hash: this.loginHash}
        };
        
        this
          .$http(options)
          .then(
            response => {
              this.urls = response.body.urls;
            },
            error => {
              console.warn(error)
            })
          .catch(error => console.warn(error));
        
      },
    },
    mounted: function () {
      console.log(" - - - - mounted - - - - ");
      let self = this;
      this.$bus.$on(
        'hash',
        function (data) {
          
          if (data && data !== '') {
            self.loginHash = data;
          }
          else {
            self.loginHash = '';
          }
          self.getUrls();
          
        })
    },
    
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    text-align: left;
  }
  
  li {
    display: block;
    margin: 0 10px;
    text-align: left;
    
  }
  
  a {
    color: #42b983;
  }
  
  td.text {
    text-align: left;
  }
  
  td.hours {
    text-align: right;
  }
  
  .hash{
    font-family: monospace;
    font-size: 16px;
    font-style: normal;
    font-variant: normal;
    font-weight: 500;
    line-height: 1.2em;
  }
</style>
