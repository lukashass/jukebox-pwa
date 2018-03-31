<template>
<div>
  <h1 v-if="!isConnected">No connection to server.</h1>
  <div v-else>
    <div v-if="error === 'no lobby found'">
      <p>Couldn't find lobby "{{ id }}"</p>
      <input type="text" :value="id" @keyup.enter="submit" />
    </div>
    <p v-else-if="lobby.length === 0">Joining lobby "{{ id }}"</p>
    <div v-else>
      <p>You are in lobby <i>{{ lobby.name }}</i> hosted by <i>{{ lobby.host }}</i></p>
      <p v-if="!lobby.isSpotifyConnected">Ask the host to connect to Spotify</p>
      <div v-else>
        <p>Currently playing {{ lobby.playingTrack }}</p>
        <div v-for="track in lobby.queue">
            <img :src="track.images[track.images.length - 1].url" height="50px"/> {{ track.name }}
            <div>{{ track.score }}</div>
            <button @click="upvote(track.id)" :class="{selected: (track.votes[null] === 1) }">upvote</button>
            <button @click="downvote(track.id)" :class="{selected: (track.votes[null] === -1) }">downvote</button>
        </div>
      </div>
      <a :href="authUrl" v-if="authUrl">Login Spoty</a>
      <button @click="addTrack('6XobSqCw4kUJCm4gBUtbSJ')">Add song</button>
      <button @click="reqAuth(id)">Request AuthURL</button>
      <search @add-track="addTrack" :result="searchResults"></search>
    </div>
  </div>
</div>
</template>

<script>
import Search from './Search.vue'

export default {
  data() {
    return {
      isConnected: false,
      lobby: [],
      isAdmin: false,
      userId: null,
      authUrl: '',
      authCode: '',
      error: '',
      searchResults: ''
    }
  },

  components: {
    Search
  },

  sockets: {
    connect() {
      console.log('connected');
      // Fired when the socket connects.
      this.isConnected = true
      this.reqLobby(this.id)
      // this.addTrack('6XobSqCw4kUJCm4gBUtbSJ')

      if (this.authCode) {
        this.authCallback(this.authCode)
        this.authCode = ''
      }
    },

    disconnect() {
      this.isConnected = false
      this.lobby = []
    },

    // listeners

    lobby(data) {
      console.log(data)

      this.error = ''
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
        case 'authUrl':
          this.authUrl = data.url
          break
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
          this.$set(this.tracks, data.track.id, data.track)
          break
        case 'search':
          this.searchResults = data.results
          break
        default:
          console.log(data.type)
      }
    },

    system(data) {
      console.log(data)

      this.error = ''
      if (data.error) {
        this.error = data.msg
        console.log(data.msg)
        return
      }

      switch (data.type) {
        case 'userId':
          this.userId = data.userId
          setCookie('userId', data.userId, 10)
          break
        default:
          console.log(data.type)
      }
    }
  },

  methods: {
    reqLobby(lobby) {
      this.$socket.emit('system', {
        type: 'select',
        lobbyId: lobby,
        userId: this.userId
      })
      console.log('select')
    },
    reqAuth(id) {
      this.$socket.emit('lobby', {
        type: 'authUrl',
        url: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/callback/'
      })
      console.log('auth')
    },
    addTrack(id) {
      this.$socket.emit('lobby', {
        type: 'addTrack',
        track: id
      })
      console.log('add');
    },
    upvote(id) {
      this.$socket.emit('lobby', {
        type: 'upvote',
        track: id
      })
    },
    downvote(id) {
      this.$socket.emit('lobby', {
        type: 'downvote',
        track: id
      })
    },
    authCallback(code) {
      this.$socket.emit('lobby', {
        type: 'authCallback',
        code: code
      })
    },
    submit(event) {
      this.$router.push({
        name: 'lobby',
        params: {
          id: event.target.value
        }
      })
    },
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

  // {type: 'upvote', track: <track>}

  // channel: spotify
  // {type: 'track', track: <track>}
  // socket.emit('spotify', {type: 'track', track: track})

  // {type: 'search', query: <query>}
  // socket.emit('spotify', {type: 'search', results: results})

  watch: {
    id: function(newVal) {
      this.reqLobby(newVal)
    }
  },

  props: ['id'],

  created: function() {
    // catches GET code and removes it from url
    this.authCode = this.$route.query.code
    this.$router.push({
      path: this.$route.path,
      query: null
    })

    this.userId = getCookie('userId')
  }
}

function setCookie (cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return null
}
</script>
