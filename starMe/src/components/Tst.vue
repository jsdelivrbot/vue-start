<template>
  <div class="tst">
    <h1>{{ msg }}</h1>
    <h2>Started at {{ date }}</h2>
    <!--<h3 v-model="loginHash"> Current hash is-->
    <!--<pre>{{loginHash}}</pre>-->
    <!--</h3>-->
    <!--<br>-->
    <div class="inputs">
      <md-theme md-name="teal">
        
        <md-input-container class="md-layout task">
          <label>
            <icon name="tasks"></icon>
            TASK</label>
          <md-textarea v-model="currentText"></md-textarea>
        </md-input-container>
        <md-input-container class="md-layout hours">
          <label>
            <icon name="clock-o"></icon>
            HOURS</label>
          <md-textarea v-model="currentHours"></md-textarea>
        </md-input-container>
        <md-input-container class="md-layout url">
          <label>
            <icon name="link"></icon>
            URL</label>
          <md-textarea v-model="currentUrl"></md-textarea>
        </md-input-container>
        
        <md-button v-on:click="(e) => addTask(currentText,currentHours)" :disabled="!loginHash" class="md-primary">
          <icon class='btn-icon' name="plus"></icon>
        </md-button>
        <md-button v-on:click="(e) => saveTasks()" :disabled="!loginHash" class="md-primary">
          <icon class='btn-icon' name="cloud-upload"></icon>
        </md-button>
        <md-button v-on:click="(e) => getTasks()" :disabled="!loginHash" class="md-primary">
          <icon class='btn-icon' name="cloud-download"></icon>
        </md-button>
        <md-button v-on:click="(e) => getHash()" :disabled="!loginHash" class="md-primary">
          <icon class='btn-icon btn-red' name="cloud-download"></icon>
        </md-button>
      
      </md-theme>
    </div>
    
    
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
              <md-button class="md-accent btn-icon" v-on:click="e=>removeTodo(index)">
                <icon class="btn-icon" name="trash"></icon>
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
      });
      
    },
    name: 'tst',
    data() {
      return {
        
        currentHours: 100500,
        currentText: 'Learn VUE',
        
        msg: 'This is a test TODO list',
        date: new Date().toLocaleString(),
        tasks: [{text: 'learn', hours: '10'}],
        loginHash: '',
        
      }
    },
    methods: {
      
      removeTodo: function (index) {
        this.tasks.splice(index, 1);
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
          url: '/saveTasks',
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
          url: '/getTasks',
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
        
      },
      getHash: function () {
        this.$bus.$emit('getHash', null);
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
  
  .buttons, .inputs {
    font-size: 24px;
    position: relative;
    width: 100%;
    display: inline-block;
  }
  
  .task, .hours, .url {
    display: inline-block;
    width: 25%;
  }
  
  .hours {
    width: 7%;
  }


  .fa-icon {
    width: auto;
    height: 1em; /* or any other relative font sizes */
    
    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;
  }

</style>
