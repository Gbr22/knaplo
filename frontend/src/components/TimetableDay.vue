<template>
    <div class="day" :class="{ event:isEventOnDay(day) }">
        <template v-if="!isEventOnDay(day)">
            <h2>{{ getDayName(day.day) }}</h2>
            <div
                v-for="lesson in day.lessons"
                :key="lesson.id" class="lesson"
                @click="openLesson(lesson)"
                :class="{
                    substitute:lesson.substituteTeacherName != null,
                    dismissed:lesson.state.id == lesson.states.dismissed,
                }"
            >
                <template v-if="!isEvent(lesson)">
                    <span class="timeIndex">
                        
                        <div class="index">
                            {{ lesson.lessonNumber != null ? lesson.lessonNumber : "-" }}
                        </div>
                        <div class="time">
                            {{ formatTime(lesson.startDate) }}
                            <br>
                            {{ formatTime(lesson.endDate) }}
                        </div>
                    </span>
                    <span class="vr"></span>
                    <span class="mainContent">
                        <span class="subject">{{ lesson.subjectName }}</span>
                        <span class="theme">
                            <span class="short">{{ lesson.state.id == lesson.states.dismissed ? "Elmaradt": shortenText(lesson.theme || "",30) }}</span>
                            <span class="long">{{ lesson.state.id == lesson.states.dismissed ? "Elmaradt" : lesson.theme }}</span>
                        </span>
                    </span>
                    <span class="padding"></span>
                    <span class="moreInfo">
                        <span class="classRoom">{{ lesson.classRoom }}</span>
                        <span class="teacher">
                            <span v-if="lesson.substituteTeacherName" class="isSubstitute">*</span>
                            <span class="short">{{ shortName(lesson.substituteTeacherName || lesson.teacherName || "") }}</span>
                            <span class="long">{{ lesson.substituteTeacherName || lesson.teacherName }}</span>
                            <Icon src="fi/edit-3" v-if="lesson.homeworkId"/>
                            <Icon src="fi/file-text" v-if="getTestForLesson(lesson)"/>
                        </span>
                    </span>
                </template>
                <template v-if="isEvent(lesson)">
                    {{ (lesson.subjectName || "").trim() }}
                </template>

            </div>
        </template>
        <div v-if="isEventOnDay(day)">
            <span class="text">
                {{ (EventOnDay(day).subjectName || "").trim() }}
            </span>
        </div>

    </div>
</template>

<script>
import { getTestForLesson } from '../dataHandler';
import GlobalState from '../globalState';
import { formatTime, getDayName, getDayShortName, shortenText } from '../util';
import { openLesson } from './modals/LessonModal.vue';

export default {
    name:"TimetableDay",
    props:["day"],
    methods: {
        getDayName,
        formatTime,
        shortenText,
        getDayShortName,
        shortName(name){
            return name.split(" ").map((e,i)=>i == 0 ? e : e[0]).join(" ");
        },
        isEventOnDay(day){
            return this.EventOnDay(day) != null;
        },
        EventOnDay(day){
            return day.lessons.filter(e=>this.isEvent(e))[0] || null;
        },
        isEvent(lesson){
            return lesson.type.id == lesson.types.event;
        },
        getTestForLesson,
        openLesson(lesson){
            console.log("openlesson",lesson);
            openLesson(lesson);
            /* 
            let id = lesson.HaziFeladatUid;
            
            var homework = GlobalState.processedData.homeworks.filter(e=>e.id == id)[0];
            if (homework){
                openHomework(homework);
            } */
            
        },
    },
}
</script>

<style scoped>
    .day.event {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .day.event .text {
        font-size: 20px;
        
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
        margin: 8px auto;
        padding: 6px 0;
        overflow: hidden;
    }
    .padding {
        width: 10px;
        flex-grow: 1;
        flex-shrink: 0;
    }
    .index {
        font-size: 30px;
    }
    .time {
        font-size: 12px;
        margin: 0 auto;
    }
    .mainContent {
        flex-grow: 1;
        /* flex-grow: 2;
        flex-shrink: 2;
         */
    }
    
    .mainContent, .timeIndex, .vr {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    
    .moreInfo {
        flex: none;
        flex-shrink: 1;
        display: block;
        text-align: right;
        padding-right: 8px;
    }
    .mi span {
        font-weight: bold;
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
        
        min-width: 67px;
        flex: none;
        flex-direction: row;
    }
    .index {
        padding: 0 7px;
        padding-left: 9px;
    }
    
    .moreInfo /deep/ svg {
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
        justify-content: flex-end;
        font-weight: bold;
    }
    .teacher, .theme, .time {
        color: var(--text-light-color);
    }
    .short {
        display: none;
    }
    .substitute .index, .substitute .teacher {
        /* color: var(--theme-color); */
        color: var(--substitute-teacher-color);
    }
    .dismissed .index, .dismissed .theme {

        color: var(--lesson-dismissed-color);
        
    }
    .dismissed .subject, .dismissed .moreInfo, .dismissed .time {
        opacity: 0.7;
    }
    .isSubstitute {
        color: var(--text-light-color);
    }

    .desktop .long {
        display: none;
    }
    .desktop .short {
        display: block;
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