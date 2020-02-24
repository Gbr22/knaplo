Vue.component('k-recent', {
    props: {
      recent: {
          type: Object,
          required: true,
      },
      ignoremode : {
          type: Boolean,
          required: false
      }
    },
    data(){
        return {};
    },
    methods: {
        checkShowRecent(mode){
            return data.recentMode == "all" || data.recentMode == mode;
        },
        formatDate,
        getDayOfWeek,
    },
    template: `
    <span v-show="checkShowRecent(recent.recentType) || ignoremode">
        <div v-if="recent.recentType == 'grade'" class="grade gradeLike recent">
            <span class="left" :data-grade="recent.value">
                {{ recent.value }}
            </span>
            <span class="right">
                <div class="header">
                    {{ recent.subject }}
                </div>
                <span class="bottom">{{ recent.theme ? recent.theme : recent.mode }}</span>
            </span>
            <span class="date"><b>{{ getDayOfWeek(new Date(recent.date)) }}</b><br><i>{{ formatDate(new Date(recent.date)) }}</i></span>
        </div>
        <div v-if="recent.recentType == 'absence'" class="absence gradeLike recent" v-bind:class="{ justified: recent.justified }">
            <span class="left" :data-grade="recent.value">
                <svg class="feather">
                    <use xlink:href="/node_modules/feather-icons/dist/feather-sprite.svg#clock"/>
                </svg>
            </span>
            <span class="right">
                <div class="header">
                    {{ recent.TypeName }} - 
                    <span v-if="recent.justified">Igazolt ({{ recent.JustificationTypeName }})</span>
                    <span v-if="!recent.justified">Igazolatlan</span>
                </div>
                <span class="bottom">
                    <span v-if="recent.Type=='AbsentDay'">Érintett órák: {{ recent.lessons.join(", ") }}</span>
                    <span v-if="recent.Type!='AbsentDay'">{{ recent.NumberOfLessons }}. Óra - {{ recent.Subject }}<i v-if="recent.Type=='Delay'">, {{ recent.DelayTimeMinutes }} perc</i></span>
                </span>
            </span>
            <span class="date"><b>{{ getDayOfWeek(new Date(recent.date)) }}</b><br><i>{{ formatDate(new Date(recent.date)) }}</i></span>
        </div>
        <div v-if="recent.recentType == 'note'" class="note recent">
            <h3>{{ recent.Title }}</h3>
            <p>{{ recent.Content }}</p>

            <span class="signoff">{{ recent.Type }}, {{ recent.Teacher }}</span>

            <span class="date">{{ formatDate(new Date(recent.date)) }} {{ getDayOfWeek(new Date(recent.date)) }}</span>
            
        </div>
    </span>
    `
})