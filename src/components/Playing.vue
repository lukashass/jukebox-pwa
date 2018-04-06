<template>
<div class="playing">
  <track-progress v-if="track.offset !== null" :track="track"></track-progress>
  <div class="content">
    <img :src="track.images[track.images.length - 1].url" height="50px" />
    <div class="info">
      <span class="artist">{{ track.name }}</span><br />
      <span>{{ track.artists }}</span>
    </div>
  </div>
</div>
</template>

<script>
import trackProgress from './Progress.vue'

export default {
  name: 'playing',
  data() {
    return {}
  },

  components: {
    trackProgress
  },

  props: ['track']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.playing {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: black;
  color: white;
  text-align: center;
  padding-bottom: 1px;
}

.content {
  padding-top: 5px;
}

img {
  display: inline-block;
}

.artist {
  text-decoration: bold;
}
</style>
