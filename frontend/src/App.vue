<template>
  <div id="app">
    <div id="pageviewer">
      <Login v-if="!loggedIn && loaded" v-bind:class="{ modalBg:isModalOpen() }" />
      <Screens v-if="loggedIn" v-bind:class="{ modalBg:isModalOpen() }" />
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
import ThemeHandler from './themeHandler';
import { isModalOpen } from './components/Modal.vue';
ThemeHandler;

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
  },
  methods:{
      isModalOpen,
  }
}
</script>

<style scoped>
#pageviewer {
    flex: 1;
    overflow-y: auto;
    position: relative;
}
#app {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-y: hidden;
}
</style>
<style>
#pageview_inner {
  overflow-y: auto;
  position: relative;
  width: 100%;
  height: 100%;
}

.notransition * { 
  -webkit-transition: none !important; 
  -moz-transition: none !important; 
  -o-transition: none !important; 
  -ms-transition: none !important; 
  transition: none !important; 
} 
* {
    font-family: Helvetica, sans-serif;
}
.modalBg {
    filter: blur(10px);
}
html, body, #app {
    margin: 0;
    padding: 0;
    overflow: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: auto;
}
.btn {
    border: none;
    color: var(--text-color);
    background-color: var(--element-color);
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: var(--elem-shadow);
    transition: all 0.15s ease;
    background-color: var(--button-color);
    outline: none;
}
.btn:hover {
    opacity: 0.7;
    transform: scale(0.97);
}

h1, h2, h3, h4, h5, h6 {
    margin: 0;
}

::selection {
  background-color: var(--theme-5);
  color: var(--text-selection-color);
}
* {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
}
.selectable, .selectable * {
    -webkit-tap-highlight-color: initial;
    user-select: text !important;
}


:root {
    --theme-5: #88D498;
    
    --color-light: #DCE0D9;
    
    --vh: 1vh;
    --vh-100: calc(var(--vh) * 100);
}
body, button, input {
    color: var(--text-color);
}
body {
    stroke: var(--text-color);
}

body, .list, #recent, .fullpage_modal {
    background-color: var(--bg-color);
}

.feather {
    
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
}

@media (hover: hover) and (pointer: fine) {
    #app {
        flex-direction: column-reverse !important;
    }
    .pc-no-scroll {
        overflow: hidden !important;
    }
    ::-webkit-scrollbar {
        width: 16px;
        height: 16px;
    }
    ::-webkit-scrollbar-thumb {
        background: var(--divider-color);
        background-clip: padding-box;
        border: 4px solid transparent;
        border-radius: 8px;
        box-shadow: none;
        min-height: 50px;
    }
    ::-webkit-scrollbar-button {
        width: 4px;
        height: 4px;
        background: none;
        border: none;
    }
    ::-webkit-scrollbar-track {
        background: none;
        border: none;
    }
}

</style>
