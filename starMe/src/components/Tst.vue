<template>
  <div class="tst">
    <h1>{{ msg }}</h1>
    <h2>{{ date }}</h2>
    <span v-bind:title="title">
          Hover your mouse over me for a few seconds to see my dynamically bound title!
    </span>
    
    <br>
    <button v-on:click="(e) => addTask(currentText,currentHours)">add task</button>
    <button v-on:click="(e) => saveTasks()">save tasks</button>
    <button v-on:click="(e) => addTask(currentText,currentHours)">get tasks</button>
    <br>
    <input type="text" v-model="currentText">
    <input type="text" v-model="currentHours">
    
    <table>
    <tr v-for="todo in tasks">
      <td class="text">{{ todo.text }}</td>
      <td class="hours">{{ todo.hours }}</td>
    </tr>

    </table>
  
  
  </div>
</template>

<script>
  export default {
//    el:'#tst',
    name: 'tst',
    data () {
      return {
        
        currentHours: 100500,
        currentText: 'Learn VUE',
        
        msg: 'This is a test message',
        date: new Date().toLocaleString(),
        title: new Date(),
        tasks: [{text: 'buy milk', hours: 5}, {text: 'buy cheese', hours: 5},]
      }
    },
    methods: {
      reverseMessage: function () {
        this.message = this.message.split('').reverse().join('')
      },
      addTask: function (text, hours) {
        this.tasks.push({text: text, hours: hours})
      },
      saveTasks: function () {
        let options = {
          method: 'post',
          url: 'http://127.0.0.1:3000/saveTasks',
          headers: {
            // TODO MAKE HASH GLOBAL or GET FROM LOGIN COMPONENT
            auth: this.loginHash
          },
          body: {hash:'123',tasks:this.tasks}
        };
  
        this
          .$http(options)
          .then(response => {
            // get body
            console.log(response.body);
            this.loginHash = response.body.hash ? response.body.hash : this.loginHash;
      
      
            // get status
            console.log(response.status);
            // get status text
            console.log(response.statusText);
            // get 'Expires' header
            response.headers.get('Expires');
            // get headers
            console.log(response.headers);
            // get body data
            this.someData = response.body;
          }, error => {
            console.warn(error)
          })
          .catch(error => console.warn(error));
  
      }
      
      
    }
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
  
  td.text{
    text-align: left;
  }
  
  td.hours{
    text-align: right;
  }
</style>
