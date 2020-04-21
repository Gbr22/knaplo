<template>
  <button v-bind:class="{ active: GlobalState.currentMenu.indexOf(navTo)==0 }" v-on:click="navigate(navTo)">
        <svg class="feather">
            <use :xlink:href="getFiURL('#'+icon)"/>
        </svg>
        <b>{{ text }}</b>
        
    </button>
</template>

<script>
import GlobalState from '../globalState';
import { navigate, getFiURL } from '../util';


export default {
    name:"NavItem",
    props:["navTo","icon","text"],
    data:()=>(
        {
            GlobalState   
        }
    ),
    methods:{
        getFiURL,
        navigate
    }
}
</script>

<style>

</style>