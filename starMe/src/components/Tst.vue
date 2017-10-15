<template>
  <div class="tst">
    <h1>{{ msg }}</h1>
    <h2>Started at {{ date }}</h2>
    <h3 v-model="loginHash"> Current hash is
      <pre>{{loginHash}}</pre>
    </h3>
    <br>
    <md-theme md-name="teal">
      <div>
        <md-button
          v-on:click="(e) => addTask(currentText,currentHours)"
          :disabled="!loginHash"
          class="md-primary"
        >
          add task
        </md-button>
        <md-button v-on:click="(e) => saveTasks()" :disabled="!loginHash" class="md-primary">
          save tasks
        </md-button>
        <md-button v-on:click="(e) => getTasks()" :disabled="!loginHash" class="md-primary">
          get tasks
        </md-button>
      </div>
    </md-theme>
    
    
    <br>
    <input type="text" v-model="currentText">
    <input type="text" v-model="currentHours">
    <input type="text" v-model="currentUrl">
    <div>
      
      <md-table>
        <md-table-header>
          <md-table-row>
            <md-table-head>index</md-table-head>
            <md-table-head>text</md-table-head>
            <md-table-head md-numeric>hours</md-table-head>
            <md-table-head>remove</md-table-head>
          </md-table-row>
        </md-table-header>
        
        <md-table-body>
          <md-table-row v-for="(todo, index) in tasks">
            <md-table-cell md-numeric>{{index}}</md-table-cell>
            
            <md-table-cell v-for="cell in todo">{{cell}}</md-table-cell>
            <md-table-cell>
              <md-button class="md-icon-button md-raised md-accent" v-on:click="e=>removeTodo(index)">
                X
              </md-button>
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
    mounted: function () {
      console.log(" - - - - mounted - - - - ");
      let self = this;
      this.$bus.$on('hash', function (data) {
        if (data && data !== '') {
          self.loginHash = data;
          self.getTasks();
        }
        else {
          self.saveTasks();
          self.loginHash = '';
          self.tasks = [];
        }
      })
    },
    name: 'tst',
    data () {
      return {
        
        currentHours: 100500,
        currentText: 'Learn VUE',
        
        msg: 'This is a test TODO list',
        date: new Date().toLocaleString(),
        tasks: [],
        loginHash: '',
        
      }
    },
    methods: {
      
      removeTodo: function (index) {
        this.tasks.splice(index,1);
//        console.log(JSON.stringify(this.tasks.splice(index)) + ' removed ' + index);
        console.log(index, this.tasks[index]);
        this.saveTasks();
      },
      
      addTask: function (text, hours) {
        
        this.tasks.push({text: text, hours: hours});
        this.tasks = this.tasks.sort((el1, el2) => el1.hours - el2.hours);
        
      },
      saveTasks: function () {
        
        console.log('this.loginHash');
        console.log(this['loginHash']);
        
        let options = {
          method: 'post',
          url: 'http://127.0.0.1:3000/saveTasks',
          headers: {
            // TODO MAKE HASH GLOBAL or GET FROM LOGIN COMPONENT
            auth: this.loginHash
          },
          body: {hash: this.loginHash, tasks: this.tasks}
        };
        
        
        this
          .$http(options)
          .then(
            response => {
            },
            error => {
              console.warn(error)
            })
          .catch(error => console.warn(error));
        
      },
      getTasks: function () {
        let options = {
          method: 'post',
          url: 'http://127.0.0.1:3000/getTasks',
          headers: {
            // TODO MAKE HASH GLOBAL or GET FROM LOGIN COMPONENT
            auth: this.loginHash
          },
          body: {hash: this.loginHash}
        };
        
        this
          .$http(options)
          .then(response => {
            this.tasks = response.body.tasks || [];
            this.tasks = this.tasks.sort((el1, el2) => el1.hours - el2.hours);
          }, error => {
            console.warn(error)
          })
          .catch(error => console.warn(error));
        
      }
      
      
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
</style>
