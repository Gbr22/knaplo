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
        <div v-if="selectedWeek && isDesktopView()" class="desktop">
            <TimetableDay v-for="day in selectedWeek.days" :key="day.day" :day="day" />
        </div>
        <TabMenu v-if="selectedWeek && !isDesktopView()" :titles="selectedWeek.days.map(day=>getDayShortName(day.day))">
            <template>
                <TimetableDay v-for="day in selectedWeek.days" :key="day.day" :day="day" />
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
import TimetableDay from '../components/TimetableDay.vue';



export let updateTT = ()=>{};

export default {
    name:"Timetable",
    components: {
        Swiper,
        SwiperSlide,
        TabMenu,
        TimetableDay
    },
    directives: {
        swiper: directive
    },
    computed: {
      
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
        
    },
    methods:{
        isDesktopView(){
            return GlobalState.window.width > 1400;
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
    #timetable {
        display: flex;
        flex-direction: column;
    }
    .desktop {
        display: flex;
        flex-direction: row;
        /* justify-content: center; */
        overflow: auto;
        flex: 1;
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
    
    
    
    
    
    
    
</style>