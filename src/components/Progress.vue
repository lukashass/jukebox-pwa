<template>
<div class="progress">
  <div class="amount" :style="{ width: progress + '%', transition: running ? 'width 10s linear' : 'width 0s linear'}"></div>
</div>
</template>

<script>
import {
  EventBus
} from './event-bus.js'

export default {
  name: 'track-progress',
  data() {
    return {
      time: 0,
      interval: null,
      running: false
    }
  },

  methods: {
    timer: function() {
      console.log(this.running);
      clearInterval(this.interval)
      this.time = this.track.offset + this.track.start - Date.now()
      this.running = true
      this.time += 10000

      var self = this
      this.interval = setInterval(function() {
        self.time += 10000
        console.log(self.time);
        if (self.time >= self.track.duration) {
          clearInterval(self.interval)
        }
      }, 10000)
    },
    reset: function(timestamp) {
      console.log(this.running);
      clearInterval(this.interval)
      this.running = false
      this.time = this.track.start - timestamp
    }
  },

  computed: {
    progress: function() {
      return this.time / this.track.duration * 100
    }
  },

  watch: {
    track: function() {
      console.log(this.track.start, this.track.duration);
      this.timer()
    }
  },

  props: ['track'],

  bus: function() {
    var self = this
    return EventBus.$on('pause', function(timestamp) {
      console.log(timestamp);
      self.reset(timestamp)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.progress {
  left: 0;
  top: 0;
  height: 1px;
  background-color: #444;
}

.amount {
  background-color: #fff;
  height: 2px;
}
</style>
