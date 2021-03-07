<template>
    <div class="html-root selectable">
        <div class="inner" v-html="formatURLsHTML(html)">

        </div>
    </div>
</template>

<script>
import { formatURLsHTML } from '../util'

export default {
    props:["html"],
    methods: {
        formatURLsHTML,    
    },
}
</script>

<style scoped>
    .html-root {
        box-sizing: border-box;
    }
    .html-root .inner :first-child {
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
    .html-root .inner :last-child {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }
    .inner /deep/ p {
        /* margin: 8px 0; */
    }
</style>