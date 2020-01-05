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
        <div v-if="recent.recentType == 'grade'" class="grade recent">
            <span class="left" :data-grade="recent.value">
                {{ recent.value }}
            </span>
            <span class="right">
                <div class="grade_header">
                    {{ recent.subject }}
                </div>
                <span class="bottom">{{ recent.theme ? recent.theme : recent.mode }}</span>
            </span>
            <span class="date"><b>{{ getDayOfWeek(new Date(recent.date)) }}</b><br><i>{{ formatDate(new Date(recent.date)) }}</i></span>
        </div>
        <div v-if="recent.recentType == 'absence'" class="absence recent">
            <h3>{{ recent.TypeName }} - {{ recent.JustificationTypeName }}</h3>
            <p>{{ recent.NumberOfLessons }}. Óra - {{ recent.Subject }}<i v-if="recent.Type=='Delay'">, {{ recent.DelayTimeMinutes }} perc</i></p>

            <span class="date">{{ formatDate(new Date(recent.date)) }} {{ getDayOfWeek(new Date(recent.date)) }}</span>
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