<template>
  <div class="tst">
    <h1>{{ msg }}</h1>
    <h2>{{ date }}</h2>
    <span v-bind:title="title">
          Hover your mouse over me for a few seconds to see my dynamically bound title!
    </span>
  </div>
</template>

<script>
  export default {
    name: 'tst',
    data () {
      return {
        msg: 'This is a test message',
        date: new Date(),
        title: new Date(),
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
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
</style>
