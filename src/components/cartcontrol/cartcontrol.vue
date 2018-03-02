<template>
  <div class="cartcontrol-component">
    <transition name='move'>
      <div class="minus-btn" v-show='food.count>0' v-on:click.stop='minusCountNum'>
        <i class="icon-minus-circle"></i>
      </div>
    </transition>
    <div class="num" v-show='food.count>0'>
      {{food.count}}
    </div>
    <div class="plus-btn" v-on:click.stop='addCountNum($event)'>
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>


<script type="text/javascript">
  // 引入Vue，以便使用 Vue.set 接口
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    methods: {
      addCountNum: function(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          // 添加早已初始化的数据对象的属性时，想要使 Vue 也监测得到，可以使用 Vue.set 这个接口
          Vue.set(this.food, 'count', 1);
        } else {
          console.log(this.food.count);
          this.food.count++;
        }
        // 触发父组件事件，触发掉下小球
        this.$emit('setdropball', event.target);
      },
      minusCountNum: function() {
        if (this.food.count > 0) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  .cartcontrol-component
    font-size: 0
    .minus-btn, .plus-btn
      display: inline-block
      vertical-align: top
      font-size: 24px
      color: rgb(0, 160, 220)
      .icon-minus-circle
        display: inline-block
    .num
      display: inline-block
      vertical-align: top
      width: 24px
      line-height: 24px
      font-size: 10px
      text-align: center
      color: rgb(147, 153, 159)
  // 定义动画
  .move-enter
    opacity: 0
    transform: translate3d(24px, 0, 0)
    .icon-minus-circle
      transform: rotate(180deg)
  .move-enter-to
    opacity: 1
    transform: translate3d(0, 0, 0)
    .icon-minus-circle
      transform: rotate(0)
  .move-leave-to
    opacity: 0
    transform: translate3d(24px, 0, 0)
    .icon-minus-circle
      transform: rotate(180deg)
  .move-leave
    opacity: 1
    transform: translate3d(0, 0, 0)
    .icon-minus-circle
      transform: rotate(0)
  .move-enter-active
    transition: all .3s linear
    .icon-minus-circle
      transition: all .3s linear
  .move-leave-active
    transition: all .3s linear
    .icon-minus-circle
      transition: all .3s linear
</style>
