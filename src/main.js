import Vue from 'vue';
import app from './App';
import router from './router';
import VueResource from 'vue-resource';
import store from './store';

// 全局注册插件 Vue-Resource
Vue.use(VueResource);

// import Router from 'vue-router';
// import goods from 'components/goods/goods';
// import ratings from 'components/ratings/ratings';
// import seller from 'components/seller/seller';

// Vue.use(Router);

// const router = new Router({
//   routes: [
//     { path: '/goods', name: 'good1', component: goods },
//     { path: '/ratings', name: 'rating1', component: ratings },
//     { path: '/seller', name: 'sellern1', component: seller }
//   ]
// });

// 下面注释用于eslint忽略
/* eslint-disable no-new */
new Vue({
  el: '#abc',
  router,
  store,
  components: {
    App: app
  },
  // 一开始，使用的是 mounted 生命周期钩子，这会导致在评价路由页面刷新时报错
  // 这是因为 生命周期的理解问题，当点击刷新
  // 首先执行的是 初始化Vue 实例的 created
  // 然后是子组件的 created，再到子组件的 mounted
  // 最后才是 初始化Vue 实例的 mounted
  // 另外处于与当前不同路由的子组件，只会在点击跳转路由的时候执行 生命周期钩子函数
  // 所以当在评论页面上刷新时，会先执行评论子组件的 created，然后执行 初始化Vue 实例的 mounted
  // 而 $nextTick() 方法又是异步，则当执行初始化Vue实例的 mounted 转到 '/goods' 页面后，才执行 $nextTick()，从而读取不了DOM树报错
  created: function() {
    router.replace('/goods');
  }
});
