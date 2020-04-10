<template>
    <div id="pageview_inner">
        <Averages v-if="currentMenu == 'avgs'" />
        <Timeline v-show="currentMenu == 'timeline'"/>
        <Timetable v-show="currentMenu == 'timetable'"/>
        <Homework v-show="currentMenu == 'homework'"/>
        <Settings v-if="currentMenu == 'settings'"/>
        <HalfYr v-if="currentMenu == 'halfyr'"/>
    </div>
</template>

<script>
import Settings from './view/Settings';
import HalfYr from './view/HalfYr';
import Timeline from './view/Timeline';
import Averages from './view/Averages';
import Timetable from './view/Timetable.vue';
import Homework from './view/Homework.vue';

export default {
    name:"Screens",
    components:{
        Timetable,
        Homework,
        Settings,
        HalfYr,
        Timeline,
        Averages,
    },
    data:()=>{
        return GlobalState
    }
}
</script>

<style>

</style>