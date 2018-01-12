<template>
  <h1 class="aaa">{{msg}}</h1>
</template>

<script>
  export default{
    name: 'login',
    data () {
      return {
        msg: 'this is msg'
      }
    }
  }
</script>

<style>
  .aaa {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
