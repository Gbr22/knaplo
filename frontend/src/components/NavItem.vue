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
            let to = this.navTo;
            GlobalState.currentMenu = to;
            localStorage.setItem("currentMenu",to);
        }
    }
}
</script>

<style>

</style>