<template>
    <div class="homeworkList">
        <h2 class="title">{{ title }} ({{ list.length }})</h2>
        <div class="homework" v-for="elem in list" :key="elem.id" @click="openHomework(elem)">
            <div class="header">
                <span class="subject">{{ elem.lesson.Subject }}</span>
                <span class="until"><i>{{ formatDate(elem.homework.FeladasDatuma) }}</i> - {{ formatDate(elem.homework.Hatarido) }}</span>
            </div>
            <div class="desc">{{ getText(elem) }}</div>
        </div>
    </div>
</template>

<script>
import { shortenText, htmlToText, formatURLsHTML, formatDate } from '../util'
import { openHomework } from '../components/modals/HomeworkModal.vue';

export default {
    name:"HomeworkList",
    props:["list","title"],
    methods:{
        formatDate,
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
    .until i {
        font-style: normal;
        color: var(--text-smol);
    }
    .desc {
        color: var(--text-smol);
    }
</style>