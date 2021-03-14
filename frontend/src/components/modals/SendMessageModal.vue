<template>
  <div class="modalRoot">
    <div class="recipients">
      <span>Címzettek: </span>
      <span v-for="r in recipients" :key="r.id">{{ r.name }}</span>
    </div>
    <div class="subject">
      <input type="text" v-model="subject" placeholder="Tárgy">
    </div>
    <div class="content">
      <textarea v-model="content"></textarea>
    </div>
    <div class="send">
      <button class="btn" @click="send()">Küldés</button>
    </div>
  </div>
</template>

<script>
import { sendMessage } from "../../api";




let SendMessageModal = {
    name:"SendMessageModal",
    props:["obj"],
    data(){
      let r = [];
      if (this.obj.recipients){
        r.push(...this.obj.recipients);
      }

      return {
        recipients:r,
        subject:"",
        content:"",
      }
    },
    methods:{
      send(){
        sendMessage({
          recipients: this.recipients,
          subject: this.subject,
          content: this.content,
        });  
      }
    },
    mounted() {
        
    },
    components:{
        
    }
}
export default SendMessageModal;


export function openSendMessage(options = {}){
    openModal("Üzenet küldése",SendMessageModal,options);
}
window.openSendMessage = openSendMessage;

</script>

<style scoped>
  .modalRoot {
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  input, textarea {
    box-sizing: border-box;
    outline: none;
    padding: 10px;
    border-radius: 12px;
    font-size: 15px;
    border: 1px solid;
    border-color: var(--divider-color);
    background-color: var(--element-color);
    color: var(--text-color);
    width: 100%;
  }
  .subject {
    margin: 20px 0;
  }
  .content {
    flex: 1;
    margin-bottom: 20px;
  }
  textarea {
    resize: none;
    width: 100%;
    height: 100%;
    min-width: 250px;
    min-height: 200px;
  }
    
</style>