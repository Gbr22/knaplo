<template>
    <div class="screen" id="timetable">
        <div class="header">
            <h1>Órarend</h1>
            <h2 v-if="selectedWeek">
                <button @click="changeWeek(-1)" v-bind:class="{ nomore: !nextWeek(-1) }">
                    <svg class="feather">
                        <use xlink:href="feather-sprite.svg#chevron-left"/>
                    </svg>
                </button>
                <span class="text">{{ TTfrom() }} - {{ TTto() }}</span>
                <button @click="changeWeek(1)" v-bind:class="{ nomore: !nextWeek(1) }">
                    <svg class="feather">
                        <use xlink:href="feather-sprite.svg#chevron-right"/>
                    </svg>
                </button>
            </h2>
            <div id="dayButtons" v-if="selectedWeek">
                <button v-for="(day, index) in selectedWeek.days" :key="day.day" class="dayButton" v-bind:class="{active: index == dayIndex }" @click="gotoDay(index)">
                    {{ getDayShortName(day.day) }}
                </button>
            </div>
            
        </div>
        <div v-if="selectedWeek" id="tableWrap" @scroll="tableScroll" class="pc-no-scroll">
            <div v-for="day in selectedWeek.days" :key="day.day" class="day">
                <h2>{{ getDayName(day.day) }}</h2>
                <div v-for="lesson in day.lessons" :key="lesson.LessonId" class="lesson" @click="openLesson(lesson)">
                    <span class="timeIndex">
                        
                        <div class="index">
                            {{ lesson.Count != -1 ? lesson.Count : "-" }}
                        </div>
                        <div class="time">
                            {{ formatTime(lesson.StartTime) }}
                            <br>
                            {{ formatTime(lesson.EndTime) }}
                        </div>
                    </span>
                    <span class="vr"></span>
                    <span class="mainContent">
                        <span class="subject">{{ lesson.Subject }}</span>
                        <span class="theme">
                            <span class="short">{{ shortenText(lesson.Theme,30) }}</span>
                            <span class="long">{{ lesson.Theme }}</span>
                        </span>
                    </span>
                    <span class="moreInfo">
                        <span class="classRoom">{{ lesson.ClassRoom }}</span>
                        <span class="teacher">
                            <span class="short">{{ shortName(lesson.Teacher) }}</span>
                            <span class="long">{{ lesson.Teacher }}</span>
                            <svg class="feather" v-if="lesson.TeacherHomeworkId">
                                <use xlink:href="feather-sprite.svg#edit-3"/>
                            </svg>
                        </span>
                    </span>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import GlobalState from '../globalState'
import { formatDate, getDayName, getDayShortName, formatTime, shortenText } from '../util';
import { openHomework } from '../components/modals/HomeworkModal.vue';
import { getHomework } from '../api';
import { getWeekReactive } from '../dataHandler';

export let updateTT = ()=>{};

export default {
    name:"Timetable",
    data(){
        let timetable = GlobalState.processedData.timetable;    

        let weekIndex = 0;
        let o = {
            weekIndex,
            GlobalState,
            timetable,
            selectedWeek:getWeekReactive(weekIndex),
            dayIndex:0,
        }
        updateTT = function(){
            o.selectedWeek=getWeekReactive(o.weekIndex);
        };

        return o;
    },
    methods:{
        openLesson(lesson){
            let id = lesson.TeacherHomeworkId;
            
            function afterHomework(homework){
                if (homework){
                    openHomework({lesson,homework});
                }
            }
            if (id == null){
                afterHomework(null);
            } else {
                getHomework(id).then((result)=>{
                    if (result){
                        afterHomework(result);
                    } else {
                        afterHomework(null);    
                    }
                }).catch(()=>{
                    
                    afterHomework(null);

                })
            }
            console.log(lesson);
        },
        gotoDay(index){
            if (this.selectedWeek){
                let e = document.getElementById("tableWrap");
                let scroll = e.scrollWidth/this.selectedWeek.days.length * index;
                e.scrollTo({
                    top:0,
                    left:scroll,
                    
                })
            }
            
        },
        tableScroll(event){
            if (this.selectedWeek){
                let e = event.target;
                let index = Math.round(e.scrollLeft / (e.scrollWidth/this.selectedWeek.days.length));
                this.dayIndex = index;
            }
            
        },
        nextWeek(direction){
            return true;
        },
        changeWeek(direction){
            this.weekIndex += direction;
            this.selectedWeek = getWeekReactive(this.weekIndex);
        },
        shortenText,
        shortName(name){
            return name.split(" ").map((e)=>e[0]).join(" ");
        },
        getDayName,
        getDayShortName,
        formatTime,
        TTfrom(){
            return formatDate(this.selectedWeek.first);
        },
        TTto(){
            return formatDate(this.selectedWeek.last);
        },
        
        
    },
}
</script>

<style scoped>
    .header {
        padding: 20px;
        text-align: center;
    }
    .header h2 {
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .header h2 button.nomore svg {
        visibility: hidden;
    }
    .header h2 button {
        background: none;
        border: none;
        outline: none;
    }
    .header h2 svg {
        stroke: var(--text-smol);
    }
    #tableWrap {
        white-space: nowrap;
        width: 100%;
        display: block;
        overflow: auto;
        scroll-snap-type: x mandatory;
        overflow: hidden; /*TODO: Fix scroll crash*/
    }
    #tableWrap * {
        white-space: normal;
    }
    #dayButtons {
        display: flex;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        margin-top: 20px;
        box-shadow: var(--elem-shadow);
        border-radius: 8px;
        overflow: hidden;
        background: var(--element-color);
    }
    #dayButtons button.active {
        color: var(--theme-color);
        background-color: rgba(28, 170, 83, 0.10);
    }
    #dayButtons button {
        height: 30px;
        flex: 1;
        font-weight: bold;
        background-color: transparent;
        border:none;
        outline: none;
        transition: all 0.2s;
    }
    .day {
        scroll-snap-align: center;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
    .day h2 {
        text-align: center;
    }
    .lesson {
        display: flex;
        align-items: center;
        margin: 8px 0;
        padding: 6px 0;
    }
    
    .index {
        font-size: 30px;
    }
    .time {
        font-size: 12px;
        margin: 0 auto;
    }
    .mainContent {
        flex-grow: 2;
        flex-shrink: 2;
        
    }
    .teacher {
        
    }
    .mainContent, .moreInfo, .timeIndex, .vr {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .vr {
        margin: 0 5px;
        height: 50px;
        width: 1px;
        background-color: var(--divider-color);
        display: block;
    }
    .timeIndex {
        
        font-weight: bold;
        
        align-items: center;
        justify-content: flex-start;
        
        width: 67px;
        flex: none;
        flex-direction: row;
    }
    .index {
        padding: 0 7px;
        padding-left: 9px;
    }
    .moreInfo {
        align-items: flex-end;
        padding: 0 10px;
        flex: 1 1;
        width: max(40%, 250px);
        text-align: right;
    }
    .moreInfo svg {
        width: 18px;
        height: 18px;
        display: block;
        flex: 1 none;
        stroke: var(--link-color);
    }
    .subject, .classRoom {
        font-weight: bold;
    
    }
    .teacher {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .teacher, .theme, .time {
        color: var(--text-smol);
    }
    .short {
        display: none;
    }
    @media screen and (max-width: 680px) {
        
        .long {
            display: none;
        }
        .short {
            display: block;
        }
        
    }
</style>