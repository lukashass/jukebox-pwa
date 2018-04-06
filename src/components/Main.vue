<template>
<div>
  <h1 v-if="!isConnected">No connection to server.</h1>
  <div v-else>
    <div v-if="error === 'no_lobby_found'">
      <p>Couldn't find lobby "{{ lobbyId }}"</p>
      <input type="text" :value="lobbyId" @keyup.enter="submit" />
    </div>
    <p v-else-if="!isLobbySelected">Joining lobby "{{ lobbyId }}"</p>
    <div v-else>
      <lobby :lobbyId="lobbyId" :userId="userId"></lobby>
    </div>
  </div>
</div>
</template>

<script>
import Lobby from './Lobby.vue'

export default {
  data() {
    return {
      isConnected: false,
      isLobbySelected: false,
      userId: null,
      error: null
    }
  },

  components: {
    Lobby
  },

  sockets: {
    connect() {
      console.log('connected');
      // Fired when the socket connects.
      this.isConnected = true
      this.sendUser()
      this.isLobby(this.lobbyId)
      // this.addTrack('6XobSqCw4kUJCm4gBUtbSJ')
    },

    disconnect() {
      this.isConnected = false
      this.isLobbySelected = false
    },

    // listeners

    system(data) {
      console.log(data)

      this.error = null
      if (data.error) {
        this.error = data.msg
        console.log(data.msg)
        return
      }

      switch (data.type) {
        case 'user':
          this.userId = data.userId
          setCookie('userId', data.userId, 10)
          break
        case 'lobby':
          this.isLobbySelected = data.isLobby
        default:
          console.log(data.type)
      }
    }
  },

  methods: {
    sendUser() {
      this.$socket.emit('system', {
        type: 'auth',
        userId: this.userId
      })
    },
    isLobby(lobby) {
      this.$socket.emit('system', {
        type: 'isLobby',
        lobbyId: lobby,
      })
    },
    submit(event) {
      this.$router.push({
        name: this.$route.name,
        params: {
          lobbyId: event.target.value
        }
      })
    },
  },

  watch: {
    lobbyId: function(newVal) {
      this.isLobby(newVal)
    }
  },

  props: ['lobbyId'],

  created: function() {
    this.userId = getCookie('userId')
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie(cname) {
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
