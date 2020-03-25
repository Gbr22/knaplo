<template>
  <button v-bind:class="{ active: false }" v-on:click="navigate">
        <svg class="feather">
            <use v-bind:xlink:href="'/fi#'+icon"/>
        </svg>
        <b>{{ text }}</b>
        
    </button>
</template>

<script>
export default {
    name:"NavItem",
    props:["navTo","icon","text"],
    data:()=>(
        {
            
        }
    ),
    methods:{
        navigate(){
            let to = this.navTo;
            console.log(to);
        }
    }
}
</script>

<style>

</style>