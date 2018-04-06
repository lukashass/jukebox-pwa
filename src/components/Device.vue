<template>
<div class="device">
  <a @click="setDevice(device.id)">
    <icon :name="types[device.type]"></icon> - {{ device.name }}</a>
</div>
</template>

<script>
import 'vue-awesome/icons/desktop'
import 'vue-awesome/icons/mobile-alt'
import 'vue-awesome/icons/headphones'

export default {
  name: 'device',
  data() {
    return {
      types: {
        Computer: 'desktop',
        Smartphone: 'mobile-alt',
        Speaker: 'headphones'
      }
    }
  },

  methods: {
    setDevice(id) {
      this.$socket.emit('admin', {
        type: 'device',
        device: id
      })
      console.log('set');
    }
  },

  props: ['device']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
