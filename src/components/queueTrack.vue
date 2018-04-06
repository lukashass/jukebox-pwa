<template>
<div class="queue-track">
  <a @click="downvote(track.id)" class="downvote" :class="{selected: (track.vote && track.vote === -1) }">
    <icon name="thumbs-down" scale="1.8"></icon>
  </a>
  <img :src="track.images[track.images.length - 1].url" height="50px" />
  <div class="info">
    <span>{{ track.name }}</span><br />
    <span>{{ track.artists }}</span>
  </div>
  <a @click="upvote(track.id)" class="upvote" :class="{selected: (track.vote && track.vote === 1) }">
    <icon name="heart" scale="1.8"></icon>
  </a>
</div>
</template>

<script>
import 'vue-awesome/icons/heart'
import 'vue-awesome/icons/thumbs-down'

export default {
  name: 'queue-track',
  data() {
    return {}
  },

  methods: {
    upvote(id) {
      this.$socket.emit('lobby', {
        type: 'upvote',
        track: id
      })
      console.log('vote');
    },
    downvote(id) {
      this.$socket.emit('lobby', {
        type: 'downvote',
        track: id
      })
    }
  },

  props: ['track']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.selected {
  color: red;
}

.queue-track {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 1fr;
  align-items: center;
}

.queue-track a {
  font-size: 50px;
}
</style>
