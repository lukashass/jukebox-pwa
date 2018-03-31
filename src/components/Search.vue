<template>
<div class="search">
  <h1>Search</h1>
  <p>
    <input v-model="query">
    <button @click="query = 'britney'">britney</button>
  </p>
  <p v-if="!result">
    {{ message }}
  </p>
  <div v-for="track in result">
    <img :src="track.images[track.images.length - 1].url" height="50px"/>{{ track.artists }} - {{ track.name }} - <button @click="$emit('add-track', track.id)">Add song</button>
  </div>
</div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'search',
  data() {
    return {
      query: '',
      message: 'Search now!'
    }
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
