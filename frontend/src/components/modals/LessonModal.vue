<template>
  <div class="root">
      <div class="header">
          <div class="lessonNumber">{{ obj.lessonNumber }}</div>
          <div>
              <div class="time">{{formatTime(this.obj.startDate)}} - {{formatTime(this.obj.endDate)}}</div>
              <div class="classRoom">{{ obj.classRoomName }}</div>
          </div>
      </div>
      <DetailsList :list="getList()" />
      <div class="hw" v-if="obj.homeworkId" @click="openHomework()">
          <Icon src="fi/home" color="var(--link-color)" />
          <span>{{ getHomeworkText() }}</span>
      </div>
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate, getDayOfWeek, formatTime, shortenText, toOneLine, htmlToText } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';
import { getGradeColor } from '../../dataHandler';
import DetailsList from '../DetailsList.vue';
import HomeworkListItem from '../HomeworkListItem.vue';
import { openHomework } from './HomeworkModal.vue';




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
        openHomework(){
            openHomework(this.getHomework());
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
                ["Csoport", this.obj.obj.OsztalyCsoport.Nev],
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
    .hw .icon {
        margin-right: 10px;
        flex: 0;
    }
    .hw {
        flex: 1;
    }
    .hw:hover {
        opacity: 0.65;
    }
    .hw {
        padding: 20px;
        padding-bottom: 0;
        color: var(--link-color);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.25s opacity;
    }
</style>