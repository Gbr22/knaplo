<template>
  <div id="app">
    <Login v-if="!loggedIn" />
    <div v-if="loggedIn" id="pageviewer">
      <div id="pageview_inner">
        <Averages v-if="currentMenu == 'avgs'" />
        <Timeline v-show="currentMenu == 'timeline'"/>
        <Timetable v-show="currentMenu == 'timetable'"/>
        <Homework v-show="currentMenu == 'homework'"/>
        <Settings v-if="currentMenu == 'settings'"/>
        <HalfYr v-if="currentMenu == 'halfyr'"/>
      </div>
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
import Timetable from './view/Timetable.vue';
import Homework from './view/Homework.vue';



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
    Averages,
    Timetable,
    Homework
  },
  data:()=>{
    return GlobalState
  }
}
</script>

<style>
#pageviewer {
  position: relative;
}
#pageview_inner {
  overflow-y: auto;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
