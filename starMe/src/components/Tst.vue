<template>
  <div class="tst">
    <h1>{{ msg }}</h1>
    <h2>{{ date }}</h2>
    <span v-bind:title="title">
          Hover your mouse over me for a few seconds to see my dynamically bound title!
    </span>
    
    <br>
    <button v-on:click="(e) => addTask(currentText,currentHours)">add task</button>
    <button>send tasks</button>
    <button>get tasks</button>
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
