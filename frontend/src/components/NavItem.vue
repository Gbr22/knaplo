<template>
  <button v-bind:class="{ active: GlobalState.currentMenu.indexOf(navTo)==0 }" v-on:click="navigate(navTo)">
        <Icon :src="icon" />
        <b>{{ text }}</b>
    </button>
</template>

<script>
import GlobalState from '../globalState';
import { navigate } from '../util';
import Icon from './Icon';

export default {
    name:"NavItem",
    props:["navTo","icon","text"],
    data:()=>(
        {
            GlobalState   
        }
    ),
    components:{
        Icon,
    },
    methods:{
        navigate
    }
}
</script>

<style>

</style>