import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './router.js'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(VueRouter, axios)

const router = new VueRouter({
    routes: routes,
    mode: 'history'
})

new Vue({
    render: h => h(App),
    router: router,
}).$mount('#app')
