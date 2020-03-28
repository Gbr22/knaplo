<template>
  <div id="app">
    <Login v-if="!loggedIn" />
    <div v-if="loggedIn" id="pageviewer">
      <Timeline v-show="currentMenu == 'timeline'"/>
      <Settings v-if="currentMenu == 'settings'"/>
      <HalfYr v-if="currentMenu == 'halfyr'"/>
    </div>
    <Nav v-if="loggedIn" />
    <MessageDisplay />
  </div>
</template>

<script>
import Login from './view/Login';
import Settings from './view/Settings';
import HalfYr from './view/HalfYr';
import GlobalState from './globalState';
import MessageDisplay from './components/MessageDisplay';
import Nav from './components/Nav';
import Timeline from './view/Timeline';

export default {
  name: 'App',
  components: {
    Login,
    Settings,
    MessageDisplay,
    Nav,
    HalfYr,
    Timeline
  },
  data:()=>{
    return GlobalState
  }
}
</script>

<style>

</style>
