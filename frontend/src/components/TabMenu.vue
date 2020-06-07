<template>
    <div>
        <div>
            <button v-for="(t, index) in titles" :key="t" class="titleButton" v-bind:class="{active: index == tabIndex }" @click="gotoTab(index)">
                {{ t }}
            </button>
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
    

</style>