<template>
  <div v-html="obj.html" class="htmlContent"></div>
</template>

<script>
export default {
    name:"ModalContent",
    props:["obj"]
}
</script>

<style scoped>
    .htmlContent {
        padding: 20px;
        box-sizing: border-box;
        padding-top: 0;
    }
</style>