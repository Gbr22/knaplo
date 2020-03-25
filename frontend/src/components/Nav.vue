<template>
    <nav id="menu" v-bind:class="{ loading_data: true }">
        <NavItem v-for="i in items" :key="i.navTo" :navTo="i.navTo" :text="i.text" :icon="i.icon" />
        <div id="loading_data">
            <div id="loading_percent" v-bind:style="{ '--loaded': 100+'%' }"></div>
        </div>
    </nav>
</template>

<script>
import NavItem from './NavItem';

export default {
    name: 'App',
    components: {
        NavItem
    },
    data:()=>(
        {
            items: [
                {text:"Átlagok", navTo:"avgs", icon:"bar-chart-2"},
                {text:"Idővonal", navTo:"timeline", icon:"clock"},
                {text:"Lezárások", navTo:"halfyr", icon:"list"},
                {text:"Beállítások", navTo:"settings", icon:"settings"},
            ]
        }
    )
}
</script>

<style>

</style>