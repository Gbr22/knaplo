<template>
    <div class="homeworkList">
        <h2 class="title">{{ title }} (<b>{{ getCompletedCount() }}</b>/{{ list.length }})</h2>
        <div class="homework" v-for="elem in list" :key="elem.id" @click="openHomework(elem)">
            <div class="header">
                <span class="subject">{{ elem.lesson.Subject }}</span>
                <span class="until"><i>{{ formatDate(elem.homework.FeladasDatuma) }}</i> - {{ formatDate(elem.homework.Hatarido) }}</span>
            </div>
            <div class="bottom">
                <div class="desc">{{ getText(elem) }}</div>
                <button class="completed" :data-value="isCompleted(elem.homework)+''"
                    @click.stop="toggleHomeworkCompleted(elem.homework.Id)"
                >
                    <svg class="feather">
                        <use :xlink:href="'/fi#' + (isCompleted(elem.homework) ? 'check' : 'x')"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { shortenText, htmlToText, formatURLsHTML, formatDate } from '../util'
import { openHomework } from '../components/modals/HomeworkModal.vue';
import { getHomeworkCompleted, setHomeworkCompleted, toggleHomeworkCompleted, getHWCompObjFArr } from '../dataHandler';
import GlobalState from '../globalState';



export default {
    name:"HomeworkList",
    props:["list","title"],
    data(){
        let hwc = GlobalState.processedData.homeworksCompleted;
        return {
            GlobalState,
            homeworksCompleted:hwc
        }
    },
    methods:{
        formatDate,
        getCompletedCount(){
            return this.list.filter(e=>this.isCompleted(e.homework)).length;
        },
        isCompleted(hw){
            return getHWCompObjFArr(hw.Id, this.homeworksCompleted)?.value == true;
        },
        getText(elem){
            let text = htmlToText(formatURLsHTML(elem.homework.Szoveg));
            return shortenText(text, 50);
        },
        openHomework,
        shortenText,
        htmlToText,
        getHomeworkCompleted,
        toggleHomeworkCompleted
    }
}
</script>

<style scoped>
    .title {
        text-align: center;
        margin-top: 20px;
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
        display: flex;
        margin-bottom: 3px;
    }
    .header .subject {
        flex: 1;
    }
    .bottom {
        display: flex;
    }
    .completed {
        flex: none;
        border: none;
        background: none;
        padding: 0;
        outline: none;
    }
    .completed svg {
        transition: all 0.3s;
    }
    .completed[data-value="false"] svg {
        stroke: var(--text-smol);
        border: 2px solid var(--text-smol);
        background-color: var(--divider-color);
        opacity: 0.5;
        border-radius: 5px;
    }
    .title b {
        color: #4ec275;
    }
    .completed[data-value="true"] svg {
        stroke: #4ec275;
        border: 2px solid #4ec27598;
        background-color: #4ec27549;
        border-radius: 5px;
    }
    .until i {
        font-style: normal;
        color: var(--text-smol);
    }
    .desc {
        flex: 1;
        color: var(--text-smol);
        word-break: break-word;
    }
</style>