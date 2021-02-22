<template>
    <div class="screen" id="timetable">
        <div class="header">
            <h1>Órarend</h1>
            <h2 v-if="selectedWeek">
                <button @click="changeWeek(-1)" v-bind:class="{ nomore: !nextWeek(-1) }">
                    <Icon src="fi/chevron-left" />
                    
                </button>
                <span class="text">{{ TTfrom() }} - {{ TTto() }}</span>
                <button @click="changeWeek(1)" v-bind:class="{ nomore: !nextWeek(1) }">
                    <Icon src="fi/chevron-right" />
                </button>
            </h2>
            
        </div>
        <div id="emptyCont" v-if="selectedWeek && selectedWeek.days.length == 0">
            <div id="emptyWeek">
                <h2>
                    Ezen a héten nincsenek óráid
                </h2>
                <Icon src="fi/smile" />
            </div>
        </div>
        <TabMenu v-if="selectedWeek" :titles="selectedWeek.days.map(day=>getDayShortName(day.day))">
            <template>
                <div v-for="day in selectedWeek.days" :key="day.day" class="day" :class="{ event:isEventOnDay(day) }">
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
                                <span class="moreInfo">
                                    <span class="classRoom">{{ lesson.classRoomName }}</span>
                                    <span class="teacher">
                                        <span v-if="lesson.substituteTeacherName" class="isSubstitute">*</span>
                                        <span class="short">{{ shortName(lesson.substituteTeacherName || lesson.teacherName || "") }}</span>
                                        <span class="long">{{ lesson.substituteTeacherName || lesson.teacherName }}</span>
                                        <Icon src="fi/edit-3" v-if="lesson.homeworkId"/>
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
        </TabMenu>
        
    </div>
</template>

<script>
import GlobalState from '../globalState'
import { formatDate, getDayName, getDayShortName, formatTime, shortenText } from '../util';
import { openHomework } from '../components/modals/HomeworkModal.vue';
import { getWeekReactive } from '../dataHandler';
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import TabMenu from '../components/TabMenu.vue';
import { openLesson } from '../components/modals/LessonModal.vue';


export let updateTT = ()=>{};

export default {
    name:"Timetable",
    components: {
        Swiper,
        SwiperSlide,
        TabMenu,
    },
    directives: {
        swiper: directive
    },
    computed: {
      swiper() {
        let s = this.$refs.mySwiper.$swiper;
        
        s.on('slideChange', (i)=>{
            this.dayIndex = s.activeIndex;
        });
        return s;
      }
    },
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
    mounted(){
        this.swiper.slideTo(0, 0, false);
    },
    methods:{
        
        isEventOnDay(day){
            return this.EventOnDay(day) != null;
        },
        EventOnDay(day){
            return day.lessons.filter(e=>this.isEvent(e))[0] || null;
        },
        isEvent(lesson){
            return lesson.type.id == lesson.types.event;
        },
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
        gotoDay(index){
            
            if (this.selectedWeek){
                this.swiper.slideTo(index, 0, false);
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
    #emptyCont {
        
        content: '';
        background-size: cover;
        background-position: center;
        z-index: -1;
    }
    #emptyWeek, #emptyCont {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        /* right: 0;
        bottom: 0; */
    }
    #emptyWeek {
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        backdrop-filter: blur(5px);
        background-color: var(--glass-bg);
        padding-top: 50px;
        box-sizing: border-box;
        z-index: -1;
    }
    #emptyWeek h2 {
        max-width: 250px;
        text-align: center;
    }
    #emptyWeek /deep/ svg {
        margin: 5px;
        width: 35px;
        height: 35px;
    }
    .header {
        padding: 20px;
        padding-bottom: 0;
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
        stroke: var(--text-light-color);
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
        margin: 8px auto;
        padding: 6px 0;
        overflow: hidden;
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
        color: var(--theme-color);
        /* color: #FF851B; */
    }
    .dismissed .index, .dismissed .theme {
        color: #FF4136;
        
    }
    .dismissed {
        opacity: 0.7;
    }
    .isSubstitute {
        color: var(--text-light-color);
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