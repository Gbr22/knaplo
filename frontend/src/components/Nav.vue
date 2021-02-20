<template>
    <nav id="menu">
        <NavItem v-for="i in items" :key="i.navTo" :navTo="i.navTo" :text="i.text" :icon="i.icon" />
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
                {text:"Átlagok", navTo:"avgs", icon:"fi/bar-chart-2"},
                {text:"Idővonal", navTo:"timeline", icon:"fi/clock"},
                {text:"Órarend",navTo:"timetable", icon:'fi/calendar'},
                {text:"Házik",navTo:"homework", icon:'fi/edit-3'},
                {text:"Menü", navTo:"more", icon:"fi/menu"},
            ]
        }
    )
}
</script>

<style scoped>
.keyboard #menu {
    display: none;
}
#menu {
    flex:0;
    position: relative;
}

#menu.loading_data {
    transform: translateY(-4px);
}
#menu {
    display: flex;
    justify-content: space-around;
    
    text-align: center;


    background-color: var(--element-color);
    /*border-top: 1px solid #e6e6e6;*/
    
    
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-shadow: var(--menu-shadow);
    

    box-sizing: border-box;
    padding: 0 0px;
    
    z-index: 9000;
}

</style>