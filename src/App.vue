<template>
  <div id="bcd">
    <!-- 头部 -->
    <!-- 父组件使用 v-bind 指令，子组件使用 prop 选项，实行父组件与子组件的数据传递  -->
    <v-header v-bind:seller="seller"></v-header>
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="navitem">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="navitem">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="navitem">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 主内容路由 -->
    <router-view v-bind:seller="seller"></router-view>
  </div>
</template>

<script type="text/javascript">
// 引入组件
import header from 'components/header/header';

// 定义表示收取数据成功状态参数
const ERR_OK = 0;

export default {
  name: 'app',
  // 创建data属性，vue.js 中的组件需要定义成函数
  // 因为组件是可以复用的，如果定义成对象，假如对象被修改了，会引起不可预想的结果
  data() {
    return {
      seller: {}
    };
  },
  // 通过创建生命周期钩子函数created，使用 vue-resource 插件，申请商家数据
  created() {
    this.$http.get('/api/seller').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.seller = response.data;
      }
    });
  },
  // 移入组件注册
  components: {
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .navbar
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    font-size:  14px
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    .navitem
      flex: 1
      text-align: center
      & > a
        display: block
        &.active
          color: rgb(240, 20, 20)

</style>
