<template>
    <div class="homeworkList" v-if="list.length > 0">
        <h2 class="title">{{ title }} ({{ list.length }})</h2>
        <div class="list">
            <HomeworkListItem :homework="elem" v-for="elem in list" :key="elem.id" />
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
import HomeworkListItem from './HomeworkListItem.vue';



export default {
    name:"HomeworkList",
    props:["list","title"],
    data(){
        return {
            GlobalState,
            
        }
    },
    components:{
        Icon,
        HomeworkListItem
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
        
        
        openHomework,
        shortenText,
        htmlToText,
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
    
    @media screen and (min-width: 700px) {
        
        .list {
            display: block;
        }
        
    }
    /* @media screen and (min-width: 1000px) {
        .list {
            display: grid;
            grid-template-columns: auto auto auto auto;
            grid-gap: 10px;
        }
        .homework {
            margin: 0;
            padding: 20px;
        }
    } */
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
    
   
    
    
    
    
</style>