if('serviceWorker' in navigator && !window.cordova) {
  navigator.serviceWorker
           .register('/sw.js')
           .then(function() { console.log("Service Worker Registered"); });
}


import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import GlobalState from './globalState';

window.GlobalState = GlobalState;

import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { closeModal } from './components/Modal';

Vue.use(VueVirtualScroller)

new Vue({
  data:GlobalState,
  render: h => h(App),
}).$mount('#app')

function goUpPage(){
  let menus = GlobalState.currentMenu.split("/");
  if (menus.length > 1){
    menus.pop();
    GlobalState.currentMenu = menus.join("/");
    return true;
  } else {
    return false;
  }
}
window.goUpPage = goUpPage;

function onBackAction(){
  return closeModal() || goUpPage();
}
window.onBackAction = onBackAction;



history.pushState({},'');
window.onpopstate = function(){
  
  
  if (onBackAction()){
    window.history.pushState({}, '');
  } else {
    window.history.back();
  }
  
  
  
}
window.onkeydown = function(event){
  if (event.keyCode == 27){
    closeModal();
  }
}