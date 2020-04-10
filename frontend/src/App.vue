<template>
  <div id="app">
    <Login v-if="!loggedIn" />
    <div v-if="loggedIn" id="pageviewer">
      <Screens />
      <Modal />
    </div>
    <Nav v-if="loggedIn" />
    <MessageDisplay />
  </div>
</template>

<script>
import Login from './view/Login';
import GlobalState from './globalState';
import MessageDisplay from './components/MessageDisplay';
import Modal from './components/Modal';

export default {
  name: 'App',
  components: {
    MessageDisplay,
    Nav:()=>import('./components/Nav'),
    Modal,
    Login,
    Screens:()=>import("./Screens"),
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
