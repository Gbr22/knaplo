<template>
    <div class="homeworkList" v-if="list.length > 0">
        <h2 class="title">{{ title }} ({{ list.length }})</h2>
        <div class="list">
            <div class="homework lItem" v-for="elem in list" :key="elem.id" @click="openHomework(elem)">
                <div class="header">
                    <span class="subject">{{ elem.Tantargy.Nev }}</span>
                    <span class="until"><i>{{ formatDate(elem.FeladasDatuma) }}</i> - {{ formatDate(elem.HataridoDatuma) }}</span>
                </div>
                <div class="bottom">
                    <div class="desc">{{ getText(elem) }}</div>
                    <!-- <button class="completed" :data-value="elem.IsMegoldva+''"
                        @click.stop="()=>{}"
                    >
                        <Icon :src="(isCompleted(elem) ? 'fi/check' : 'fi/x')" class="icon" />
                    </button> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { shortenText, htmlToText, formatURLsHTML, formatDate, toOneLine } from '../util'
import { openHomework } from '../components/modals/HomeworkModal.vue';
import {  } from '../dataHandler';
import GlobalState from '../globalState';
import Icon from './Icon';
import {  } from '../api';



export default {
    name:"HomeworkList",
    props:["list","title"],
    data(){
        return {
            GlobalState,
            
        }
    },
    components:{
        Icon
    },
    methods:{
        formatDate,
        getCompletedCount(){
            return this.list.filter(e=>this.isCompleted(e)).length;
        },
        isCompleted(hw){
            return hw.IsMegoldva;
            /* return getHWCompObjFArr(hw.Id, this.homeworksCompleted)?.value == true; */
        },
        getText(elem){
            let text = htmlToText(formatURLsHTML(elem.Szoveg));
            return shortenText(toOneLine(text), 50);
        },
        openHomework,
        shortenText,
        htmlToText,
        getHomeworkCompleted,
        toggleHomeworkCompleted(hw){
            let inital = hw.IsMegoldva;
            /* hw.IsMegoldva = hw.IsMegoldva == "True" ? "False" : "True"; */

            toggleHomeworkDone(hw.Id).then(v=>{
                hw.IsMegoldva = v;
                console.log(hw);
            })
            .catch(e=>{
                /* hw.IsMegoldva = inital; */
            })
        }
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
    
    
    .title b {
        color: #4ec275;
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
<style>
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
    .completed[data-value="true"] svg {
        stroke: #4ec275;
        border: 2px solid #4ec27598;
        background-color: #4ec27549;
        
    }
</style>