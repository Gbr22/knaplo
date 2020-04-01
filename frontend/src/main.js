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


function onBackAction(){
  closeModal();
}
window.onpopstate = function(){
  window.history.pushState({}, '');
  onBackAction();
}
window.onkeydown = function(event){
  if (event.keyCode == 27){
    onBackAction();
  }
}