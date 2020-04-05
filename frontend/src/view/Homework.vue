<template>
    <div class="screen">
        <div class="head">
            <h1>Házi feladatok</h1>
        </div>

        <div class="homeworkList">
            <div class="homework" v-for="elem in getFiltered()" :key="elem.id" @click="openHomework(elem)">
                <div class="header">{{ elem.lesson.Subject }}</div>
                <div>{{ getText(elem) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalState from '../globalState'
import { shortenText, htmlToText, formatURLsHTML } from '../util'
import { openModal } from '../components/Modal';
import { openHomework } from '../components/modals/HomeworkModal.vue';



export default {
    name:"Homework",
    data(){
        return {
            GlobalState,
            homeworks:GlobalState.processedData.homeworks
        }
    },
    methods:{
        getFiltered(){
            return this.homeworks;
        },
        getText(elem){
            let text = htmlToText(formatURLsHTML(elem.homework.Szoveg));
            return shortenText(text, 50);
        },
        openHomework,
        shortenText,
        htmlToText
    }
}
</script>

<style scoped>
    .head {
        padding: 20px;
    }
    .homework {
        padding: 10px;
        margin: 8px 0;
    }
    .homeworkList {
        padding: 0 10px;
        box-sizing: border-box;
        word-wrap: break-word;
    }
    .homework .header {
        font-weight: bold;
    }
</style>