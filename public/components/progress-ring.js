const ProgressRing = Vue.component('progress-ring', {
    props: {
      radius: Number,
      progress: Number,
      stroke: Number,
      strokeColor:String
    },
    data() {
      const normalizedRadius = this.radius - this.stroke * 2;
      const circumference = normalizedRadius * 2 * Math.PI;
      
      return {
        normalizedRadius,
        circumference
      };
    },
    computed: {
      strokeDashoffset() {
        return this.circumference - this.progress / 100 * this.circumference;
      }
    },
    template: `
      <svg
        :height="radius * 2"
        :width="radius * 2"
       >
         <circle
            
            :stroke-dasharray="circumference + ' ' + circumference"
            :style="{ strokeDashoffset: strokeDashoffset }"
            :stroke-width="stroke"
            :stroke="strokeColor"
            fill="transparent"
            :r="normalizedRadius"
            :cx="radius"
            :cy="radius"
        />
      </svg>
    `
  });