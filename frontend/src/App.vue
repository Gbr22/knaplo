<template>
  <div id="app">
    <div id="pageviewer">
      <Login v-if="!loggedIn && loaded" />
      <Screens v-if="loggedIn"/>
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
  }
}
</script>

<style>
* {
    font-family: Helvetica, sans-serif;
}
html, body, #app {
    margin: 0;
    padding: 0;
    overflow: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    /* overscroll-behavior-y: none; */
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
    transition: all 0.3s ease;
    background-color: var(--button-color);
    outline: none;
}
.btn:hover {
    opacity: 0.7;
    transform: scale(0.95);
}
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
h1, h2, h3, h4, h5, h6 {
    margin: 0;
}

* {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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
    width: 24px;
    height: 24px;
    stroke: var(--text-color);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
}

@media (hover: hover) and (pointer: fine) {
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
