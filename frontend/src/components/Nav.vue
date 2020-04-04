<template>
    <nav id="menu" v-bind:class="{ loading_data: false }">
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
                {text:"Órarend",navTo:"timetable", icon:'calendar'},
                {text:"Házik",navTo:"homework", icon:'edit-3'},
                {text:"Lezárások", navTo:"halfyr", icon:"list"},
                {text:"Beállítások", navTo:"settings", icon:"settings"},
            ]
        }
    )
}
</script>

<style>

#menu.loading_data {
    transform: translateY(-4px);
}
#loading_data, #loading_percent {
    position: absolute;
    width: 100%;
    padding: 0;
    margin: 0;
    height: 4px;
    content: '';
    display: block;
}
#loading_data {
    bottom: -4px;
    background-color: var(--element-color);
}
#loading_percent {
    top: 0;
    left: 0;
    background: linear-gradient(270deg, #36ea6c, #277481);
    background-size: 400% 400%;

    --loaded: 0%;

    transform: translateX(calc(-100% + var(--loaded)));
    animation: loading_data 2s ease infinite;
}
@keyframes loading_data {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}

.keyboard #menu {
    display: none;
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
#menu button.active svg {
    stroke: var(--theme-color);
}
#menu button.active b {
    color: var(--theme-color);
}
#menu button.active i {
    /*color: #66ceab;*/
    color: var(--theme-color);

}
#menu button svg {
    /*stroke: #2A2D34;*/
    stroke: var(--text-color);
}
#menu button b {
    color: var(--text-color);
    display: block;
    font-weight: bold;
    font-size: 12px;
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
    
    padding: 8px 15px;
    
    box-sizing: border-box;
    vertical-align: middle;
    background: transparent;
    border: none;
    outline: none;
}

</style>