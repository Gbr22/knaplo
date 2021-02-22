<template>
    <div class="details">
        <div v-for="i in list" :key="i ? i[0] : null" class="li">
            <span  v-if="i"><span class="title">{{ i[0] }}:</span> {{ i[1] || "N/A"}}</span>
            <span class="space" v-if="i === null"></span>
        </div>
    </div>
</template>

<script>
export default {
    name:"DetailsList",
    props:["list"],
}
</script>

<style scoped>
    .details {
        padding: 0 20px;
    }
    .details .title {
        font-weight: bold;
    }
    p {
        margin: 0;
    }
    .space {
        display: block;
        background-color: var(--divider-color);
        height: 1px;
        margin: 8px 0;
    }
    .li {
        margin: 1px 0;
    }
</style>