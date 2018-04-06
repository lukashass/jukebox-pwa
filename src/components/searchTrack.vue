<template>
<div class="search-track">
  <img :src="track.images[track.images.length - 1].url" height="50px" />
  <div class="info">
    <span>{{ track.name }}</span><br />
    <span>{{ track.artists }}</span>
  </div>
  <a @click="addTrack(track.id)">
    <icon name="plus" scale="1.8"></icon>
  </a>
</div>
</template>

<script>
import 'vue-awesome/icons/plus'

export default {
  name: 'search-track',
  data() {
    return {}
  },

  methods: {
    addTrack(id) {
      this.$socket.emit('lobby', {
        type: 'addTrack',
        track: id
      })
      console.log('add');
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

.search-track {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
}

.search-track a {
  font-size: 50px;
}
</style>
