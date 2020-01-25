Vue.component('k-halfyr-grade', {
    props: {
      obj: {
          type: Object,
          required: false,
      }
    },
    data(){
        return {};
    },
    template: `
    <span>
        <div v-if="obj != null" :data-grade="obj.value">
            <a class="grade">{{ obj.value }}</a><a v-if="obj.theme=='Dicséret'" class="D">D</a>
        </div>
        <div v-if="obj == null" data-grade="#">
            <a class="grade">#</a>
        </div>
    </span>
    `
})