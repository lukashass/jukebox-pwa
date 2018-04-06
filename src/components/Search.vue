<template>
<div class="search" @keyup.esc="$emit('close')">
  <h1>Search</h1>
  <p>
    <input v-model="query" autofocus>
    <button @click="query = 'britney'">britney</button>
  </p>
  <p v-if="!result">
    {{ message }}
  </p>
  <search-track v-for="track in result" :track="track" :key="track.id"></search-track>
  <a class="closebtn" @click="$emit('close')">&times;</a>
</div>
</template>

<script>
import _ from 'lodash'
import searchTrack from './searchTrack.vue'

export default {
  name: 'search',
  data() {
    return {
      query: '',
      message: 'Search now!'
    }
  },

  components: {
    searchTrack
  },

  methods: {
    getAnswer: _.debounce(
      function() {
        if (this.query.length < 4) {
          this.message = 'Type More...'
          return
        }
        this.message = 'Searching...'
        this.$socket.emit('spotify', {
          type: 'search',
          query: this.query
        })
        console.log(this.query);
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  },

  watch: {
    query: function(newVal, oldVal) {
      this.message = 'Waiting for you to stop typing...'
      this.getAnswer()
    }
  },

  props: ['result']
}
</script>

<style media="screen">
.search {
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
  overflow-x: hidden;
}

.overlay-content {
  position: relative;
  top: 25%;
  width: 100%;
  text-align: center;
  margin-top: 30px;
}

.search a {
  padding: 8px;
  text-decoration: none;
  font-size: 36px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.search a:hover,
.overlay a:focus {
  color: #f1f1f1;
}

.search .closebtn {
  position: absolute;
  top: 2%;
  right: 2%;
  font-size: 60px;
}
</style>
