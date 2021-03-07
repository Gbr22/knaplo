<template>
    <div class="homework lItem" @click="openHomework(homework)">
        <div class="header">
            <span class="subject">{{ homework.Tantargy.Nev }}</span>
            <span class="until"><i>{{ formatDate(homework.FeladasDatuma) }}</i> - {{ formatDate(homework.HataridoDatuma) }}</span>
        </div>
        <div class="bottom">
            <div class="desc">{{ getText(homework) }}</div>
            <div class="descLong" v-html="getLongText(homework)"></div>
        </div>
    </div>
</template>

<script>
import { formatDate, formatURLsHTML, htmlToText, shortenText, toOneLine } from '../util';
import { openHomework } from './modals/HomeworkModal.vue'

export default {
    name:"HomeworkListItem",
    props:["homework"],
    methods: {
        openHomework,
        formatDate,
        getLongText(elem){
            let text = htmlToText(formatURLsHTML(elem.Szoveg)).replace(/\n/,"<br/>");
            return text;
        },
        getText(elem){
            let text = htmlToText(formatURLsHTML(elem.Szoveg));
            return shortenText(toOneLine(text), 50);
        },
    },
}
</script>

<style scoped>
    
    .header .subject {
        flex: 1;
    }
    .bottom {
        display: flex;
    }
    .homework {
        padding: 10px;
        margin: 8px 0;
        width: 100%;
    }
    .homework .header {
        font-weight: bold;
        display: flex;
        margin-bottom: 3px;
    }
    .title b {
        color: #4ec275;
    }
    .until {
        text-align: right;
    }
    .until i {
        font-style: normal;
        color: var(--text-light-color);
    }
    .desc {
        flex: 1;
        color: var(--text-light-color);
        word-break: break-word;
    }
    .descLong {
        flex: 1;
        color: var(--text-light-color);
        display: none;
    }
    @media screen and (min-width: 700px) {
        .desc {
            display: none;
        }
        .descLong {
            display: block !important;
            max-height: 53px;
            overflow: hidden;
        }
        .homework {
            width: 250px;
            height: unset;
            display: inline-block;
            margin: 8px;
            padding: 20px;
            vertical-align: top;
        }
    }
</style>