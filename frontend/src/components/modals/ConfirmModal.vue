<template>
    <div>
        <button @click="confirm()" class="btn">Igen</button>
        <button @click="close()" class="btn">Mégsem</button>
    </div>
</template>

<script>
import { openModal } from "../Modal.vue";


let ConfirmModal = {
    name:"ConfirmModal",
    props:["obj","close"],
    data(){
        return {};
    },
    methods:{
        confirm(){
            this.obj.onConfirm();
            this.close();
        }
    }
}
export function openComfirm(title,callback){
    let obj = {
        onConfirm:callback
    }
    openModal(title,ConfirmModal,obj);
}
export default ConfirmModal;
</script>

<style scoped>
    div {
        text-align: center;
        margin-bottom: 20px;
    }
    button {
        margin: 10px 5px;
        margin-bottom: 5px;
    }
</style>