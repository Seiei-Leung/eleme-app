import Vue from 'vue';
import Router from 'vue-router';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

// 全局注册插件 Vue-Resource
Vue.use(Router);

export default new Router({
  routes: [
    { path: '/goods', name: 'good1', component: goods },
    { path: '/ratings', name: 'rating1', component: ratings },
    { path: '/seller', name: 'sellern1', component: seller }
  ],
  // 用于规定激活状态下 <router-link> 所添加的类名
  linkActiveClass: 'active'
});
