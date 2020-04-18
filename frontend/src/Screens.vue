<template>
    <div id="pageview_inner" ref="screens" class="container pull-to-refresh-material">
        <div class="ptr pull-to-refresh-material__control">
            <svg class="icon pull-to-refresh-material__icon" fill="#4285f4" width="24" height="24" viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>

            <svg class="pull-to-refresh-material__spinner" width="24" height="24" viewBox="25 25 50 50">
                <circle class="pull-to-refresh-material__path" cx="50" cy="50" r="20" fill="none" stroke="#4285f4" stroke-width="4" stroke-miterlimit="10" />
            </svg>
        </div>
        <Averages v-if="currentMenu == 'avgs'" />
        <Timeline v-show="currentMenu == 'timeline'"/>
        <Timetable v-show="currentMenu == 'timetable'"/>
        <Homework v-show="currentMenu == 'homework'"/>
        <Settings v-if="currentMenu == 'more'"/>
        <HalfYr v-if="currentMenu == 'more/halfyr'"/>
    </div>
</template>

<script>
import Settings from './view/Settings';
import HalfYr from './view/HalfYr';
import Timeline from './view/Timeline';
import Averages from './view/Averages';
import Timetable from './view/Timetable.vue';
import Homework from './view/Homework.vue';

import pullToRefresh from 'mobile-pull-to-refresh';
import ptrAnimatesMaterial from 'mobile-pull-to-refresh/dist/styles/material/animates';
import 'mobile-pull-to-refresh/dist/styles/material/style.css';

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
    },
    mounted(){
        console.log("ref",this.$refs.screens);
        const destroyCb = pullToRefresh({
        container: this.$refs.screens,
        animates: ptrAnimatesMaterial,
        
        refresh() {
            return new Promise(resolve => {
                
                setTimeout(resolve, 2000);
            })
        }
        })
    }
}
</script>

<style>
.ptr {
    background-color: var(--element-color);
    position: fixed;
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