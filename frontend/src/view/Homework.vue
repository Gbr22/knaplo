<template>
    <div class="screen">
        <div class="head">
            <h1>Házi feladatok</h1>
        </div>

        <div class="homeworkList">
            <div class="homework" v-for="elem in getFiltered()" :key="elem.id" @click="openHomework(elem)">
                <div>{{ getText(elem) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import GlobalState from '../globalState'
import { shortenText, htmlToText, formatURLs } from '../util'
import { openModal } from '../components/Modal';


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
            let text = htmlToText(elem.homework.Szoveg);
            return shortenText(text, 50);
        },
        openHomework(elem){
            let html = elem.homework.Szoveg;
            let tag = document.createElement("span");
            tag.innerHTML = html;

            let links = tag.querySelectorAll("a[href]");
            let hasHTML = /<\/?[a-z][\s\S]*>/i.test(html);
            if (links.length == 0 && !hasHTML){
                html = formatURLs(html);
            } else {
                links.forEach((l)=>{
                    l.classList.add("link");
                })
                html = tag.innerHTML;
            }
            console.log(elem);
            openModal("Házi feladat",html);
        },
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
</style>