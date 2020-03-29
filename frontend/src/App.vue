<template>
  <div id="app">
    <Login v-if="!loggedIn" />
    <div v-if="loggedIn" id="pageviewer">
      <Averages v-if="currentMenu == 'avgs'" />
      <Timeline v-show="currentMenu == 'timeline'"/>
      <Settings v-if="currentMenu == 'settings'"/>
      <HalfYr v-if="currentMenu == 'halfyr'"/>
      <Modal />
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
import Modal from './components/Modal';
import Averages from './view/Averages';

export default {
  name: 'App',
  components: {
    Login,
    Settings,
    MessageDisplay,
    Nav,
    HalfYr,
    Timeline,
    Modal,
    Averages
  },
  data:()=>{
    return GlobalState
  }
}
</script>

<style>

</style>
