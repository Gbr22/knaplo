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

<style scoped>
#menu button.active /deep/ svg {
    stroke: var(--theme-color);
}
#menu button.active b {
    color: var(--theme-color) !important;
}
#menu button.active i {
    /*color: #66ceab;*/
    color: var(--theme-color);

}
#menu button /deep/ svg {
    /*stroke: #2A2D34;*/
    stroke: var(--text-color);
}
#menu button b {
    color: var(--text-color);
    display: block;
    font-weight: bold;
    font-size: 11px;
}
#menu button i {
    font-size: 28px;
    /*color: #c0c0c0;*/
    /*color: #1D1B27;*/
    /*color: #565663;*/
    color: #2A2D34;
}
#menu button {
    
    text-align:center;
    /*display: inline-block;*/
    
    padding: 8px 0;
    width: 48px;
    
    box-sizing: border-box;
    vertical-align: middle;
    background: transparent;
    border: none;
    outline: none;
}
</style>