<template>
  <button v-bind:class="{ active: GlobalState.currentMenu == navTo }" v-on:click="navigate">
        <svg class="feather">
            <use v-bind:xlink:href="'/fi#'+icon"/>
        </svg>
        <!-- <b>{{ text }}</b> -->
        
    </button>
</template>

<script>
import GlobalState from '../globalState';
import { closeModal } from './Modal.vue';

export default {
    name:"NavItem",
    props:["navTo","icon","text"],
    data:()=>(
        {
            GlobalState   
        }
    ),
    methods:{
        navigate(){
            closeModal();
            let to = this.navTo;
            GlobalState.currentMenu = to;
            localStorage.setItem("currentMenu",to);
        }
    }
}
</script>

<style>

</style>