<template>
    <div id="pageview_inner" ref="screens">
        
        <Screen v-for="s in screens" :key="s[1]" :comp="s[0]" :menu="s[1]" :data-screen="s[1]" />
    </div>
</template>

<script>
import Settings from './view/Settings';
import HalfYr from './view/HalfYr';
import Timeline from './view/Timeline';
import Averages from './view/Averages';
import Timetable from './view/Timetable.vue';
import Homework from './view/Homework.vue';
import Screen from './view/Screen.vue';



export default {
    name:"Screens",
    components:{
        Timetable,
        Homework,
        Settings,
        HalfYr,
        Timeline,
        Averages,
        Screen,
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
                [HalfYr,"more/halfyr"],
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
}
.link, #credits a {
    color: var(--link-color);
    text-decoration: none;
}

[data-state="5"] .left, [data-grade="5"] {
    color: #00cc66;
}
[data-state="4"] .left, [data-grade="4"] {
    color: #009999;
}
[data-state="3"] .left, [data-grade="3"] {
    color: #ffcc00;
}
[data-state="2"] .left, [data-grade="2"] {
    color: #ff6600;
}
[data-state="1"] .left, [data-grade="1"] {
    color: #b32400;
}
[data-state="#"] .left, [data-grade="#"] {
    color: #669999;
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

.gradeLike .left, .gradeLike .right{
    display: inline-block;
    vertical-align: middle;
    white-space: initial;
}
.gradeLike .right {
    width: 80%;
    width: calc(calc(100% - 43px) - 80px);
}
.gradeLike .left {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    font-size: 28px;
    font-weight: bold;

}


.gradeLike .header {
    font-weight: bold;
    margin-bottom: 3px;
}
.gradeLike .date {
    position: absolute;
    right: 10px;
    width: 80px;
    top: 0;
    bottom: 0;
    height: min-content;
    vertical-align: middle;
    margin: auto;
    text-align: right;
    
}
.recent .date {
    color: var(--text-smol);
}
.gradeLike .date b {
    font-weight: normal;
}
.gradeLike .date i {
    font-style: normal;
    font-size: 15px;
}

.gradeLike .date .relative {
    position: relative;
    display: inline-block;
    width: 100%;
}

.gradeLike .right .bottom, .absence p {
    color: var(--text-smol);
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
.youtubeEmbed iframe {
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
.subject_header {
    white-space: nowrap;
    display: flex;
    align-items: center;
}
.subject_header .left, .subject_header .right {
    
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    padding: 0;
}
.subject_header .left {
    flex: 1;
    white-space: initial;
    font-weight: bold;
}
.subject_header .right {
    flex-shrink: 0;
    width: 60px;
    text-align: right;
    vertical-align: top;
}
.subject_header .right * {
    vertical-align: middle;
}
.subject_header .right svg {
    stroke: rgb(218, 134, 95);    
}

.subject_header .right svg.up {
    stroke: #1CAA53;    
}

.subject_grades {
    color: var(--text-smol);
}
</style>