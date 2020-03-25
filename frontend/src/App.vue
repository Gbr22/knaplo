<template>
  <div id="app">
    <Login v-if="!loggedIn" />
    <div v-if="loggedIn">
      <Settings />
    </div>
    <MessageDisplay />
  </div>
</template>

<script>
import Login from './view/Login';
import Settings from './view/Settings';
import GlobalState from './globalState';
import MessageDisplay from './components/MessageDisplay'

export default {
  name: 'App',
  components: {
    Login,
    Settings,
    MessageDisplay
  },
  data:()=>{
    return GlobalState
  }
}
</script>

<style>

</style>
