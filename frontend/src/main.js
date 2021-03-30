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
import { closeModal, back } from './components/Modal';
import Icon from './components/Icon';

Vue.use(VueVirtualScroller)
Vue.component("Icon",Icon);

Vue.component('wrap-node', {
  props: {
    value: {type: [Object, Array], required: true},
    tag: {type: String, default: 'div'},
    options: {
      type: Object, default: () => {
      }
    },
  },
  render: function (h) {
    let nodes = this.value
    if (!Array.isArray(nodes)) {
      nodes = [nodes]
    }
    return h(this.tag, this.options, nodes)
  }
})

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
  return back() || goUpPage();
}
window.onBackAction = onBackAction;

if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
  console.log("back button error fix active");
  window.location = window.location; //reload page
}


setImmediate(()=>{
  history.pushState({},'');
})
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