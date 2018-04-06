<template>
<div class="lobby">
  <p>You are in lobby <i>{{ lobby.name }}</i> with <i>{{ lobby.onlineUsers }}</i> user(s), hosted by <i>{{ lobby.host }}</i></p>
  <router-link :to="{ name: 'admin', params: { lobbyId: lobbyId} }">to admin</router-link>
  <router-view :isAdmin="isAdmin"></router-view>
  <p v-if="error === 'wrong_admin_password'">Wrong Password</p>
  <p v-if="!lobby.isSpotifyConnected">Ask the host to connect to Spotify</p>
  <div v-else>
    <button @click="isSearch = true">Search</button>
    <transition name="fade">
      <search v-if="isSearch" @close="isSearch = false" :result="searchResults"></search>
    </transition>
    <transition-group name="flip-list" tag="div">
      <queue-track v-for="track in queueSorted" :track="track" :userId="userId" :key="track.id"></queue-track>
    </transition-group>
  </div>
  <playing v-if="lobby.playingTrack" :track="lobby.playingTrack"></playing>
</div>
</template>

<script>
import Vue from 'vue'
import Search from './Search.vue'
import queueTrack from './queueTrack.vue'
import Playing from './Playing.vue'
import {
  EventBus
} from './event-bus.js'

export default {
  data() {
    return {
      isAdmin: false,
      lobby: {},
      error: null,
      isSearch: false,
      searchResults: ''
    }
  },

  components: {
    Search,
    queueTrack,
    Playing
  },

  sockets: {
    // listeners

    lobby(data) {
      console.log(data)

      this.error = null
      if (data.error) {
        this.error = data.msg
        console.log(data.msg)
        return
      }

      switch (data.type) {
        case 'lobby':
          this.lobby = data.lobby
          // this.queueToTracks()
          break
        case 'track':
          for (let track of this.lobby.queue) {
            if (track.id === data.trackId) {
              Vue.set(track, 'score', data.score)
              Vue.set(track, 'position', data.position)
              break
            }
          }
          break;
        case 'newTrack':
          this.lobby.queue.push(data.track)
          break;
        case 'vote':
          for (let track of this.lobby.queue) {
            if (track.id === data.trackId) {
              Vue.set(track, 'vote', data.vote)
              break
            }
          }
          break;
        case 'playingTrack':
          this.lobby.playingTrack = data.track
          Vue.set(this.lobby.playingTrack, 'offset', data.offset)
          Vue.set(this.lobby.playingTrack, 'start', data.start)

          var queue = this.lobby.queue
          this.lobby.queue.some(function(track, i) {
            if (track.id === data.track.id) {
              Vue.delete(queue, i)
              return true
            }
          })
          break;
        case 'spotifyAccess':
          Vue.set(this.lobby, 'isSpotifyConnected', data.connected)
          break
        case 'onlineUsers':
          this.lobby.onlineUsers = data.onlineUsers
          break;
        case 'pauseTrack':
          EventBus.$emit('pause', Date.now())
          console.log('pause');
          break;
        default:
          console.log(data.type)
      }
    },

    spotify(data) {
      console.log(data)

      this.error = ''
      if (data.error) {
        this.error = data.msg
        console.log(data.msg)
        return
      }

      switch (data.type) {
        case 'track':
          Vue.set(this.tracks, data.track.id, data.track)
          break
        case 'search':
          this.searchResults = data.results
          break
        default:
          console.log(data.type)
      }
    },

    admin(data) {
      console.log(data)

      this.error = ''
      if (data.error) {
        this.error = data.msg
        console.log(data.msg)
        return
      }

      switch (data.type) {
        case 'admin':
          this.isAdmin = data.loggedin
          break
        default:
          console.log(data.type)
      }
    }
  },

  methods: {
    joinLobby() {
      this.$socket.emit('system', {
        type: 'join',
        lobbyId: this.lobbyId,
      })
    }
    /* queueToTracks() {
      for (let i in this.lobby.queue) {
        let id = this.lobby.queue[i].id
        if (!this.tracks[id]) {
          this.$socket.emit('spotify', {
            type: 'track',
            track: id
          })
        }
      }
    }*/
  },

  computed: {
    queueSorted: function() {
      return this.lobby.queue.sort((a, b) => b.score - a.score || b.position - a.position)
    }
  },

  // {type: 'upvote', track: <track>}

  // channel: spotify
  // {type: 'track', track: <track>}
  // socket.emit('spotify', {type: 'track', track: track})

  // {type: 'search', query: <query>}
  // socket.emit('spotify', {type: 'search', results: results})

  props: ['lobbyId', 'userId'],

  created: function() {
    this.joinLobby()
  }
}
</script>

<style media="screen">
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.flip-list-move {
  transition: transform .5s;
}

.lobby {
  margin-bottom: 60px;
  height: 100%;
}

.info {
  display: inline-block;
}
</style>
