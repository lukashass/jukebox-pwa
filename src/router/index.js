import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Main from '@/components/Main'
import Admin from '@/components/Admin'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/lobby/',
      component: Main
    },
    {
      path: '/lobby/:lobbyId',
      name: 'lobby',
      component: Main,
      props: true,
      children: [{
        path: 'admin',
        name: 'admin',
        component: Admin
      }]
    },
    {
      path: '/callback/',

      redirect: to => {
        const {
          query
        } = to
        if (query.state && query.code) {
          return {
            name: 'admin',
            params: {
              lobbyId: query.state
            },
            query: {
              code: query.code
            }
          }
        }
      }
    }
  ]
})
