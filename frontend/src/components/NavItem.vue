<template>
  <button v-bind:class="{ active: GlobalState.currentMenu == navTo }" v-on:click="navigate(navTo)">
        <svg class="feather">
            <use v-bind:xlink:href="'/fi#'+icon"/>
        </svg>
        <!-- <b>{{ text }}</b> -->
        
    </button>
</template>

<script>
import GlobalState from '../globalState';
import { navigate } from '../util';

export default {
    name:"NavItem",
    props:["navTo","icon","text"],
    data:()=>(
        {
            GlobalState   
        }
    ),
    methods:{
        navigate
    }
}
</script>

<style>

</style>