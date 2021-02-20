<template>
    <div class="user">
        <Icon src="fi/user" class="icon" />
        <div class="content">
            <div class="name">{{ author }}</div>
            <div class="desc">{{ desc }}</div>
        </div>
        <div class="date tinyDate"><b>{{ getDayOfWeek(date) }}</b><br><i>{{ formatDate(date) }}</i></div>
    </div>
</template>

<script>
import Icon from './Icon.vue';
import { formatDate, getDayOfWeek } from '../util';
export default {
    name:"Author",
    props:["author","desc","date"],
    components:{
        Icon
    },
    methods:{
        formatDate,
        getDayOfWeek,
    },
}
</script>

<style scoped>
    .user {
        margin: 20px;
        margin-top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .user .content {
        flex: 1;
    }
    .desc {
        color: var(--text-light-color);
        font-style: italic;
    }
    .user .icon /deep/ {
        background-color: var(--element2-color);
        padding: 8px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .date {
        margin-left: 5px;
        text-align: right;
    }
</style>