import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import GlobalState from './globalState';

window.GlobalState = GlobalState;

import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.use(VueVirtualScroller)

new Vue({
  data:GlobalState,
  render: h => h(App),
}).$mount('#app')
