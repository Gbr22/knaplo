<template>
    <div class="screen" id="timetable">
        <div class="header"><h1>Órarend <span v-if="current != null">({{ TTfrom() }} - {{ TTto() }})</span></h1></div>
        <div v-if="current != null" id="tableWrap">
            <div v-for="day in current.days" :key="day.day" class="day">
                <h2>{{ getDayName(day.day) }}</h2>
                <div v-for="lesson in day.lessons" :key="lesson.LessonId" class="lesson">
                    <span class="timeIndex">
                        <div class="index">
                            {{ lesson.Count != -1 ? lesson.Count : "-" }}
                        </div>
                        <div class="time">
                            {{ formatTime(lesson) }}
                        </div>
                    </span>
                    <span class="mainContent">
                        <span class="subject">{{ lesson.Subject }}</span>
                        <span class="theme">
                            <span class="short">{{ shorten(lesson.Theme,30) }}</span>
                            <span class="long">{{ lesson.Theme }}</span>
                        </span>
                    </span>
                    <span class="moreInfo">
                        <span class="classRoom">{{ lesson.ClassRoom }}</span>
                        <span class="teacher">
                            <span class="short">{{ shortName(lesson.Teacher) }}</span>
                            <span class="long">{{ lesson.Teacher }}</span>
                        </span>
                    </span>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import GlobalState from '../globalState'
import { formatDate, getDayName, formatTime } from '../util';



export default {
    name:"Timetable",
    data(){
        let timetable = GlobalState.processedData.timetable;
        let current = null;

        

        return {
            GlobalState,
            timetable,
            weeks:timetable.weeks,
            current,
        }
    },
    watch:{
        weeks(){
            for (let e of this.timetable.weeks){
                console.log(e);
                if (e.active){
                    this.current = e;
                }
            }
            let last = this.timetable.weeks[this.timetable.weeks.length-1];
            if (!this.current){
                this.current = last;
            }
        }
    },
    methods:{
        shorten(s,limit){
            let words = s.split(" ");
            let result = null;
            while(words.join(" ").length > limit){
                if (words.length == 1){
                    result = words[0].slice(0,limit);
                }
                words.pop();
            }
            if (result == null){
                result = words.join(" ");
            }
            if (result != s){
                return result+"...";
            } else {
                return result;
            }
        },
        shortName(name){
            return name.split(" ").map((e)=>e[0]).join(" ");
        },
        getDayName,
        TTfrom(){
            return formatDate(this.current.first);
        },
        TTto(){
            return formatDate(this.current.last);
        },
        formatTime(lesson){
            function f(dateS){
                return formatTime(new Date(dateS));
            }
            return f(lesson.StartTime)+" - "+f(lesson.EndTime);
        }
    },
}
</script>

<style scoped>
    .header {
        padding: 20px;
    }
    #tableWrap {
        white-space: nowrap;
        width: 100%;
        display: block;
        overflow: auto;
        scroll-snap-type: x mandatory;
    }
    #tableWrap * {
        white-space: normal;
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
    .timeIndex {
        display: flex;
        font-weight: bold;
        
        align-items: center;
        
        width: 85px;
        flex: none;
    }
    .index {
        font-size: 30px;
    }
    .time {
        font-size: 12px;
    }
    .mainContent {
        flex-grow: 2;
        flex-shrink: 1;
        
    }
    .teacher {
        
    }
    .mainContent, .moreInfo, .timeIndex {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .moreInfo {
        align-items: flex-end;
        padding: 0 10px;
        flex: 1 2;
        width: max(40%, 200px);
        text-align: right;
    }
    .subject, .classRoom {
        font-weight: bold;
    }
    .teacher, .theme, .time {
        color: var(--text-smol);
    }
    .short {
        display: none;
    }
    @media screen and (max-width: 680px) {
        .time {
            display: none;
        }
        .long {
            display: none;
        }
        .short {
            display: block;
        }
        .timeIndex {
            width: unset;
            padding: 0 10px;
            font-size: 18px;
        }
    }
</style>