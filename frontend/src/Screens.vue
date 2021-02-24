<template>
    <div id="pageview_inner" ref="screens">
        
        <Screen v-for="s in screens" :key="s[1]" :comp="s[0]" :menu="s[1]" :data-screen="s[1]" />
    </div>
</template>

<script>
import Settings from './view/Settings';
import Finals from './view/Finals';
import Timeline from './view/Timeline';
import Averages from './view/Averages';
import Timetable from './view/Timetable.vue';
import Homework from './view/Homework.vue';
import Screen from './view/Screen.vue';
import GlobalState from './globalState';



export default {
    name:"Screens",
    components:{
        Timetable,
        Homework,
        Settings,
        Finals,
        Timeline,
        Averages,
        Screen,
    },
    methods: {
        
    },
    data:()=>{
        return {
            GlobalState,
            screens: [
                [Averages,"avgs"],
                [Timeline,"timeline"],
                [Timetable,"timetable"],
                [Homework,"homework"],
                [Settings,"more"],
                [Finals,"more/finals"],
            ]
        }
    },
    
}
</script>

<style>

[data-screen="timeline"]{
    height: 100%;
}
.ptr {
    background-color: var(--element-color);
    position: fixed;
    z-index: 999999;
}
.ptr .icon {
    stroke: none;
    fill: var(--theme-color);
}
.ptr .spinner circle {
    stroke: var(--theme-color);
}
.link, #credits a {
    color: var(--link-color);
    text-decoration: none;
}

#recent h1 .left, #recent h1 .right {
    display: inline-block;
    vertical-align: middle;
    width: 50%;
}
#recent h1 .right {
    text-align: right;
}
#recent h1 .right svg {
    vertical-align: middle;
    height: 29px;
}
#recent h1 {
    white-space: nowrap;
    text-align: left;
    font-weight: normal;
    
    color: var(--text-color);
    background-color: rgb(170, 255, 204);
    background: transparent;
    box-sizing: border-box;
    /*color: var(--color-light);*/
    
    /*border-top-left-radius: 0;
    border-top-right-radius: 0;*/
    
    margin-top: 0px;
    margin: 10px 15px;
    font-size: 25px;
    /*box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);*/
}
#recentsList {
    padding: 0 0;
    box-sizing: border-box;
}


.recent .date, .tinyDate {
    color: var(--text-light-color);
}


.link.teams {
    color: #464775;
    color: #7173ad;
    /* filter: invert(1) hue-rotate(180deg); */
}
.link.teams i {
    font-style: normal;
}
.link.teams::before {
    display: inline-block;
    width: 25px;
    height: 25px;
    background-image: url('/services/teams.svg');
    background-position: center;
    background-size: 150%;
    background-repeat: no-repeat;
    vertical-align: middle;
    margin-top: -5px;
    content: '';
}
.youtubeEmbed {
    display: block;
    width: min(80vw, 350px);
    margin: 5px auto;
    box-sizing: border-box;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    border: 4px solid var(--divider-color);
}
.youtubeEmbed .ratio {
    display: block;
    width: 100%;
    height: auto;
    background-color: black;
}
.youtubeEmbed span {
    visibility: hidden;
    position: absolute;
    top: 0;
}
.youtubeEmbed .thumbnail {
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    -webkit-tap-highlight-color:  rgba(255, 255, 255, 0); 
}
.youtubeEmbed .thumbnail::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0;
    content: '';
    transition: opacity 0.2s ease-in-out;
}
.youtubeEmbed .play {
    width: 50px;
    height: 50px;
    background-color: var(--element-color);
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: var(--modal-shadow);
    z-index: 1;
    transition: transform 0.3s;
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
.youtubeEmbed .thumbnail .play:hover {
    transform: scale(1.17);
}
.youtubeEmbed .play::before {
    content: '';
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 15px solid var(--theme-color);
    width: 0;
    height: 0;
    transform: translateX(3px);
}
.youtubeEmbed .thumbnail:hover::before {
    opacity: 0.3;
}
.youtubeEmbed .thumbnail:hover .play::before {
    border-left-color: var(--theme-color);
}
.youtubeEmbed iframe, .youtubeEmbed .thumbnail {
    border: none;
    width: 100%;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}


.list, #subject_grades {
    margin: 0;
    padding: 10px 10px;
    box-sizing: border-box;
}

#recent {
    min-height: 100%;
}
.recent {    
    padding: 10px 12px;
    padding-left: 5px;
    
    

    white-space: nowrap;
    overflow-x: auto;

    position: relative;

    transition: background-color 0.3s ease-out;
}
.lItem, .recent, .lesson, .homework {
    list-style: none;
    width: 100%;
    font-size: 16px;
    box-sizing: border-box;

    background-color: var(--element-color);
    
    box-shadow: var(--elem-shadow);
    border-radius: 8px;
    /*border: 1px solid #e6e6e6;*/
    transition: background-color 0.3s ease-out;
}
.lItem {
    padding: 8px 12px;
    margin: 8px 0;
}
.lItem:hover, .hover .recent, .lesson:hover {
    background-color: var(--elem-active);
}

</style>