import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Lobby from '@/components/Lobby'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Hello',
    component: Hello
  },
  {
    path: '/lobby/',
    component: Lobby
  },
  {
    path: '/lobby/:id',
    name: 'lobby',
    component: Lobby,
    props: true
  },
  {
    path: '/callback/',

    redirect: to => {
      const { query } = to
      if (query.state && query.code) {
        return { name: 'lobby', params: { id: query.state }, query: { code: query.code } }
      }
    }
  }
  ]
})
