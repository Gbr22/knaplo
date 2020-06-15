<template>
    <div>
        <div class="titleCont">
            <div id="titleButtons">
                <button v-for="(t, index) in titles" :key="t" class="titleButton" v-bind:class="{active: index == tabIndex }" @click="gotoTab(index)">
                    {{ t }}
                </button>
            </div>
        </div>
        <swiper
            ref="mySwiper"
            :options="{}"
        >
            <swiper-slide v-for="(node, index) of getTabs()" :key="index" class="tab">
                <wrap-node :value="node"/>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'



export default {
    name:"TabMenu",
    components: {
        Swiper,
        SwiperSlide
    },
    directives: {
        swiper: directive
    },
    computed: {
      swiper() {
        let s = this.$refs.mySwiper.$swiper;
        
        s.on('slideChange', (i)=>{
            this.tabIndex = s.activeIndex;
        });
        return s;
      },
    },
    props:["titles"],
    created () {
        
    },
    data(){
        return {
            tabIndex: 0,
            tabs:[]
        }
    },
    mounted(){
        this.swiper.slideTo(1, 0, false);
        this.swiper.slideTo(0, 0, false);

        
    },
    methods:{
        getTabs(){
            let slots = this.$slots;
            let tabs = Object.values(slots).flat();
            return tabs;
        },
        gotoTab(index){
            this.swiper.slideTo(index, 0, false);
        }
    },
}
</script>

<style scoped>
    .titleCont {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    #titleButtons {
        display: flex;
        width: 100%;
        max-width: 500px;
        width: 100%;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
        box-shadow: var(--elem-shadow);
        border-radius: 8px;
        overflow: hidden;
        background: var(--element-color);
    }
    #titleButtons button.active {
        color: var(--theme-color);
        background-color: rgba(28, 170, 83, 0.10);
    }
    #titleButtons button {
        height: 30px;
        flex: 1;
        font-weight: bold;
        background-color: transparent;
        border:none;
        outline: none;
        transition: all 0.2s;
    }
</style>