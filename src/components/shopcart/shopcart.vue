<template>
  <div class="shopcart-compenont">
    <div class="shopcart">
      <div class="content">
        <div class="left-content" v-on:click='showList'>
          <div class="logo-wrapper">
            <div class="logo" v-bind:class="{active: selectCount > 0}">
              <i class="icon-shopping-cart"></i>
            </div>
            <div class="num" v-show="selectCount > 0">
              {{selectCount}}
            </div>
          </div>
          <div class="countPrice" v-bind:class="{active: countPrice > 0}">
            ￥{{countPrice}}
          </div>
          <div class="deliveryPrice">
            另需配送费￥{{deliveryPrice}}
          </div>
        </div>
        <div class="right-content">
          <div class="submit-btn" v-bind:class="{active: countPrice > minPrice}">
            {{submitTxt}}
          </div>
        </div>
      </div>
      <!-- 掉落小球 -->
      <div class="ball-container">
        <transition-group name='dropball' v-on:before-enter='beforeEnter' v-on:enter='enter' v-on:after-enter='afterEnter'>
          <div class="ball" v-for='ball in balls' v-show='ball.show' :key='ball.id'>
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <!-- 弹出列表 -->
      <transition name='fold'>
        <div class="selectFoodsList-container" v-show='selectCount > 0 && isShowList'>
          <div class="header">
            <span class="title">购物车</span>
            <span class="clearBtn" v-on:click='clearShopCart'>清空</span>
          </div>
          <div class="selectFoodsList" ref='selectFoodsList'>
            <ul>
              <li v-for='food in selectFoods' class="selectFoodItem">
                <div class="foodName">
                  {{food.name}}
                </div>
                <div class="right-content">
                  <div class="cartcontrol-wrapper">
                    <v-cartcontrol v-bind:food='food'></v-cartcontrol>
                  </div>
                  <div class="price">
                    <span class="sign">￥</span>
                    <span class="totalPrice">{{food.price*food.count}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!-- 浮层模拟框 -->
    <transition name='fade'>
      <div class="supernatant" v-show='selectCount > 0 && isShowList' v-on:click='hideList'>
      </div>
    </transition>
  </div>
</template>



<script type="text/javascript">
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        balls: [
          {
            id: 1,
            show: false
          },
          {
            id: 2,
            show: false
          },
          {
            id: 3,
            show: false
          },
          {
            id: 4,
            show: false
          },
          {
            id: 5,
            show: false
          }
        ],
        dropBalls: [],
        isShowList: false
      };
    },
    props: {
      // 选择食物数组
      selectFoods: {
        type: Array,
        default: function() {
          return [];
        }
      },
      // 商家最小起送价
      minPrice: {
        type: [Number, String],
        default: 0
      },
      // 商家运费
      deliveryPrice: {
        type: [Number, String],
        default: 0
      }
    },
    computed: {
      // 选择食物数量
      selectCount: function() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      // 选择食物总价钱
      countPrice: function() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.price * food.count;
        });
        return count;
      },
      // 提交按钮状态文本
      submitTxt: function() {
        if (this.countPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.countPrice < this.minPrice) {
          let difference = this.minPrice - this.countPrice;
          return `还差￥${difference}起送`;
        } else {
          return '去结算';
        }
      }
    },
    methods: {
      // 定义掉落小球方法，使小球显示(Vue 动画实现需要的条件)，并绑定触发事件的目的 DOM 对象
      drop(target) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = target;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 定义动画周期钩子参数，函数有参数传入
      beforeEnter: function(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 28;
            let y = -(window.innerHeight - rect.top - 18);
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      // 定义动画周期钩子参数
      enter: function(el) {
        // 为什么要重绘？答案：https://segmentfault.com/q/1010000006771100
        let rf = el.offsetHeight; // 用于重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      // 定义动画周期钩子参数
      afterEnter: function(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
        }
      },
      // 定义显示购物车列表方法
      showList: function() {
        this.isShowList = !this.isShowList; // 牛逼的 eslint
        if (this.isShowList && this.selectCount > 0) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.selectFoodsList, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      },
      // 定义点击模拟层，隐藏购物车列表
      hideList: function() {
        this.isShowList = false;
      },
      // 清空购物车
      clearShopCart: function() {
        this.selectFoods.forEach((food) => {
          if (food.count > 0) {
            food.count = 0;
            this.isShowList = false;
          }
        });
      }
    },
    components: {
      'v-cartcontrol': cartcontrol
    }
  };
</script>

<style lang="stylus" rel='stylesheet/stylus'>
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    .content
      display: flex
      height: 48px
      background-color: #141d27
      font-size: 0
      .left-content
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          height: 56px
          width: 56px
          box-sizing: border-box
          border-radius: 50%
          background-color: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background-color: #2b343c
            &.active
              background-color: rgb(0, 160, 220)
              .icon-shopping-cart
                color: #fff
            .icon-shopping-cart
              font-size: 24px
              color: #80858a
              line-height: 44px
          .num
            position: absolute
            top: 0
            right: 0
            padding: 0 6px
            font-size: 9px
            font-weight: 700
            height: 16px
            line-height: 16px
            background-color: rgb(240, 20, 20)
            color: #fff
            border-radius: 16px
            box-show: 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
        .countPrice
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          font-size: 16px
          font-weight: 700
          padding-right: 12px
          color: rgba(255, 255, 255, 0.4)
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          &.active
            color: #fff
        .deliveryPrice
          display: inline-block
          vertical-align: top
          line-height: 48px
          padding-left: 12px
          font-size: 10px
          color: rgba(255, 255, 255, 0.4)
      .right-content
        flex: 0 0 90
        width: 90px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        background-color: #2b343c
        color: rgba(255, 255, 255, 0.4)
        .submit-btn.active
          color: #fff
          background-color: #00b43c
    .ball-container
      .ball
        position: fixed
        bottom: 18px
        left: 28px
        .inner
          width: 24px
          height: 24px
          border-radius: 50%
          background-color: #00a0dc
          z-index: 200
      .dropball-enter-active
        transition: all .3s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          transition: all .3s linear
    .selectFoodsList-container
      position: absolute
      bottom: 48px
      width: 100%
      font-size: 0px
      z-index: -1
      .header
        overflow: hidden
        height: 40px;
        line-height: 40px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        background-color: #f3f5f7
        .title
          float: left
          margin-left: 18px
          font-size: 14px
          font-weight: 200
          color: rgb(7, 17, 27)
        .clearBtn
          float: right
          padding: 0 18px
          font-size: 12px
          color: rgb(0, 160, 220)
      .selectFoodsList
        overflow: hidden
        max-height: 217px
        padding: 0 18px
        background-color: #fff
        .selectFoodItem
          overflow: hidden
          height: 48px
          line-height: 48px
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .foodName
            float: left
            font-size: 14px
            color: rgb(7, 17, 27)
          .right-content
            float: right
            .cartcontrol-wrapper
              float: right
              margin-top: 12px
              line-height: 25px
            .price
              float: right
              margin-right: 12px
              font-size: 0
              .totalPrice
                font-size: 14px
                color: rgb(240, 20, 20)
                font-weight: 700
              .sign
                font-size: 10px
                color: rgb(240, 20, 20)
                font-weight: normal
    .fold-enter
      opacity: 0
      transform: translate3d(0, 100%, 0)
    .fold-enter-to
      opacity: 1
      transform: translate3d(0, 0, 0)
    .fold-leave-to
      opacity: 0
      transform: translate3d(0, 100%, 0)
    .fold-leave
      opacity: 1
      transform: translate3d(0, 0, 0)
    .fold-enter-active
      transition: all .3s linear
    .fold-leave-active
      transition: all .3s linear
    .fade-enter
      opacity: 0
    .fade-enter-to
      opacity: 1
    .fade-leave-to
      opacity: 0
    .fade-leave
      opacity: 1
    .fade-enter-active
      transition: all .3s linear
    .fade-leave-active
      transition: all .3s linear
  .supernatant
    position: fixed
    top: 0px
    bottom: 0
    right: 0
    left: 0
    z-index: 40
    background-color: rgba(7, 17, 27, 0.6)
</style>
