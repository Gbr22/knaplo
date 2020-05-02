<template>
    <div class="homeworkList" v-if="list.length > 0">
        <h2 class="title">{{ title }} (<b>{{ getCompletedCount() }}</b>/{{ list.length }})</h2>
        <div class="list">
            <div class="homework lItem" v-for="elem in list" :key="elem.id" @click="openHomework(elem)">
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
                            <use :xlink:href="getFiURL((isCompleted(elem.homework) ? '#check' : '#x'))"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { shortenText, htmlToText, formatURLsHTML, formatDate, toOneLine, getFiURL } from '../util'
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
        getFiURL,
        formatDate,
        getCompletedCount(){
            return this.list.filter(e=>this.isCompleted(e.homework)).length;
        },
        isCompleted(hw){
            return getHWCompObjFArr(hw.Id, this.homeworksCompleted)?.value == true;
        },
        getText(elem){
            let text = htmlToText(formatURLsHTML(elem.homework.Szoveg));
            return shortenText(toOneLine(text), 50);
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
        width: 100%;
    }
    @media screen and (min-width: 1000px) {
        /* .homework {
            padding: 20px;
            width: unset;
            flex: 1;
            min-width: 350px;
        } */
        .list {
            display: grid;
            grid-template-columns: auto auto auto auto;
            grid-gap: 10px;
        }
        .homework {
            margin: 0;
            padding: 20px;
        }
    }
    .homeworkList {
        padding: 0 10px;
        box-sizing: border-box;
        word-wrap: break-word;
    }
    .list {
        margin: 10px 0;
        /* display: flex;
        flex-direction: row;
        flex-wrap: wrap; */
        padding: 0;
        justify-content:space-between;
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
        cursor: pointer;
    }
    .completed svg {
        transition: all 0.3s;
        margin-left: 5px;
        border-radius: 8px;
    }
    .completed[data-value="false"] svg {
        stroke: var(--text-smol);
        border: 2px solid var(--text-smol);
        background-color: var(--divider-color);
        opacity: 0.5;
        
    }
    .title b {
        color: #4ec275;
    }
    .completed[data-value="true"] svg {
        stroke: #4ec275;
        border: 2px solid #4ec27598;
        background-color: #4ec27549;
        
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