<template>
    <div class="root">
        <div class="header">
            <div class="lessonNumber">{{ obj.lessonNumber != null ? obj.lessonNumber : "-" }}</div>
            <div>
                <div class="time">{{formatTime(this.obj.startDate)}} - {{formatTime(this.obj.endDate)}}</div>
                <div class="classRoom">{{ obj.classRoom }}</div>
            </div>
        </div>
        <DetailsList :list="getList()" />
        <div class="hw" v-if="obj.homeworkId && getHomework()" @click="openHomework()">
            <Icon src="fi/home" color="var(--link-color)" />
            <span>{{ getHomeworkText() }}</span>
        </div>
        <div class="test" v-if="getTest()" @click="openTest()">
            <Icon src="fi/file-text" color="var(--link-color)" />
            <div class="details">
                <div class="type">{{ getTest().mode.description }}</div>
                <div class="desc">{{ getTest().theme }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate, getDayOfWeek, formatTime, shortenText, toOneLine, htmlToText } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';
import { getGradeColor, getTestForLesson } from '../../dataHandler';
import DetailsList from '../DetailsList.vue';
import HomeworkListItem from '../HomeworkListItem.vue';
import { openHomework } from './HomeworkModal.vue';
import { openTest } from './TestModal.vue';




let LessonModal = {
    name:"LessonModal",
    props:["obj"],
    data(){
        return {

        }
    },
    methods:{
        formatDate,
        formatTime,
        getDayOfWeek,
        getTest(){
            return getTestForLesson(this.obj);
        },
        openHomework(){
            openHomework(this.getHomework());
        },
        openTest(){
            openTest(this.getTest());
        },
        getHomeworkText(){
            return shortenText(toOneLine(htmlToText(this.getHomework().Szoveg)),70);
        },
        
        getHomework(){
            
            let hw = GlobalState.processedData.homeworks.filter(e=>e.id == this.obj.homeworkId)[0];
            
            return hw;
        },
        getList(){
            var list = [
                ["Csoport", this.obj.obj?.OsztalyCsoport?.Nev],
                this.obj.theme ? ["Óra témája", this.obj.theme] : undefined,
                null,
                ["Éves óraszám", this.obj.lessonYearlyCount],
                ["Állapot", this.obj.state?.description],
                ["Jelenlét",this.obj.studentPresence?.description],
                ["Tanár", this.obj.teacherName],
                this.obj.substituteTeacherName ? ["Helyettesítő tanár", this.obj.substituteTeacherName] : undefined,
            ];
            return list;
        }
    },
    components:{
        Icon,
        Author,
        DetailsList,
        HomeworkListItem
    }
}
export default LessonModal;


export function openLesson(elem){

    let obj = elem;
    openModal(elem.subjectName,LessonModal,obj);
}


</script>

<style scoped>
    .header {
        display: flex;
        justify-content: center;
        align-items: center;


        margin-bottom: 20px;
    }
    .classRoom {
        color: var(--text-light-color);
    }
    .lessonNumber {
        font-weight: bold;
        font-size: 35px;
        margin-right: 10px;
    }
    .root {
        padding-bottom: 20px;
    }
    .hw .icon, .test .icon {
        margin-right: 10px;
        flex: 0;
    }
    .hw {
        flex: 1;
    }
    .hw:hover, .test:hover {
        opacity: 0.65;
    }
    .hw, .test {
        padding: 20px;
        padding-top: 15px;
        padding-bottom: 0;
        color: var(--link-color);
        display: flex;
        
        align-items: center;
        transition: 0.25s opacity;
    }
    .test .details {
        display: block;
    }
    .test .type {
        
    }
    .test .desc {
        /* color: var(--text-light-color); */
        font-style: italic;
        opacity: 0.8;
    }
</style>