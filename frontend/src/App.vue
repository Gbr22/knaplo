<template>
  <div id="app">
    <Login v-if="!loggedIn" />
    <div v-if="loggedIn">
      <Settings />
    </div>
  </div>
</template>

<script>
import Login from './view/Login';
import Settings from './view/Settings';
import GlobalState from './globalState';

export default {
  name: 'App',
  components: {
    Login,
    Settings,
  },
  data:()=>{
    return GlobalState
  }
}
</script>

<style>

</style>
