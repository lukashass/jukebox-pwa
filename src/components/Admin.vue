<template>
<div class="admin">
  <h1>Admin</h1>
  <div v-if="!isAdmin">
    <input type="password" v-model="passwordAdmin" @keyup.enter="authAdmin" />
  </div>
  <div v-else>
    <button @click="play()">PLAY</button>
    <button @click="pause()">pause</button>
    <button @click="skip()">skip</button>
    <button @click="getDevices()">devices</button>
    <button @click="clearTracks()">clearTracks</button>
    <button @click="reqAuth()">Login Spotify</button>
    <device v-for="device in devices" :device="device" :key="device.id"></device>
  </div>
</div>
</template>

<script>
import md5 from 'js-md5'
import Device from './Device.vue'

export default {
  name: 'admin',
  data() {
    return {
      passwordAdmin: null,
      authCode: null,
      devices: []
    }
  },

  components: {
    Device
  },

  sockets: {
    // listeners

    admin(data) {
      console.log(data)

      this.error = ''
      if (data.error) {
        this.error = data.msg
        console.log(data.msg)
        return
      }

      switch (data.type) {
        case 'authUrl':
          // open the url right away
          window.location.href = data.url
          break
        case 'devices':
          this.devices = data.devices
          break;
        default:
          console.log(data.type)
      }
    }
  },

  methods: {
    authAdmin() {
      this.$socket.emit('lobby', {
        type: 'admin',
        password: this.passwordAdmin ? md5(this.passwordAdmin) : ''
      })
    },
    reqAuth() {
      this.$socket.emit('admin', {
        type: 'authUrl',
        url: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/callback/'
      })
      console.log('auth')
    },
    authCallback(code) {
      this.$socket.emit('admin', {
        type: 'authCallback',
        code: code
      })
    },
    getDevices() {
      this.$socket.emit('admin', {
        type: 'devices'
      })
    },
    clearTracks() {
      this.$socket.emit('admin', {
        type: 'clearTracks'
      })
    },
    play() {
      this.$socket.emit('admin', {
        type: 'play'
      })
      console.log('play');
    },
    pause() {
      this.$socket.emit('admin', {
        type: 'pause'
      })
      console.log('pause');
    },
    skip() {
      this.$socket.emit('admin', {
        type: 'skip'
      })
    }

  },

  props: ['isAdmin'],

  created: function() {
    // catches GET code and removes it from url
    if (this.$route.query.code) {
      this.authCode = this.$route.query.code
      this.$router.push({
        path: this.$route.path,
        query: null
      })

      this.authCallback(this.authCode)
      this.authCode = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
