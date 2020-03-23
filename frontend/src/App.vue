<template>
  <div id="app">
    <Login v-if="!loggedIn" />
  </div>
</template>

<script>
import Login from './view/Login';
import GlobalState from './globalState';

export default {
  name: 'App',
  components: {
    Login
  },
  data:()=>{
    return GlobalState
  }
}
</script>

<style>

</style>
