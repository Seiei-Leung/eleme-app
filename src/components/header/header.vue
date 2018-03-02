<template>
  <div class="header-component">
    <div class="headerwrapper">
      <div class="info">
        <div class="avatar">
          <img v-bind:src="seller.avatar" width="64">
        </div>
        <div class="txt">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            <span>{{seller.description}}/{{seller.delivery}}分钟到达</span>
          </div>
          <!-- 这里之所以添加 v-if，是防止初始化的时候，当数据还没导进来，seller.support 是 undefined 时，访问 seller.support[0] 时报错 -->
          <div v-if="seller.support" class="support">
            <span class="icon" v-bind:class="classMap[seller.support[0].type]"></span>
            <span class="text">{{seller.support[0].description}}</span>
          </div>
        </div>
      </div>
      <div class="bulletin" v-on:click='showdetail'>
        <span class="icon"></span><span class="txt">{{seller.bulletin}}</span>
        <i class="icon-chevron-right"></i>
      </div>
      <div class="support-count" v-if="seller.support" v-on:click='showdetail'>
        <span>{{seller.support.length}}个<i class="icon-chevron-right"></i></span>
      </div>
      <div class="background-img">
        <img :src="seller.avatar">
      </div>
    </div>
    <transition name='fade'>
      <div class="seller-detail" v-show='isshowdetail'>
        <div class="detial-wrapper clearfix">
          <div class="txt-main">
            <div class="name">
              {{seller.name}}
            </div>
            <div class="star-wrapper">
              <v-star :score="seller.score" :size="48"></v-star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="txt">优惠信息</div>
              <div class="line"></div>
            </div>
            <div class="supports-wrapper" v-if="seller.support">
              <div class="support-item" v-for="support in seller.support">
                <span class="icon" v-bind:class="classMap[support.type]"></span>
                <span class="txt">{{support.description}}</span>
              </div>
            </div>
            <div v-else>
              无
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="txt">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin-wrapper">
              <p>{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="close-btn" v-on:click='hidedetail'>
          <i class="icon-x"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
import star from 'components/star/star';

export default {
  name: 'header',
  props: ['seller'],
  data() {
    return {
      classMap: ['decrease', 'special', 'discount', 'invoice', 'guarantee'],
      isshowdetail: false
    };
  },
  components: {
    'v-star': star
  },
  methods: {
    showdetail: function() {
      this.isshowdetail = true;
    },
    hidedetail: function() {
      this.isshowdetail = false;
    }
  }

};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin.styl'

  .headerwrapper
    position: relative
    background-color: rgba(7,17,27,.5)
    color: #fff
    padding-top: 24px
    .info
      font-size: 0
      margin-left: 24px
      .avatar
        display: inline-block
        border-radius: 2px
        overflow: hidden
      .txt
        display: inline-block
        margin: 2px 0 0 16px
        .title
          .brand
            display: inline-block
            width:30px
            height: 18px
            bg-image('img/brand')
            background-size: 100%
            background-repeat: no-repeat
          .name
            font-size: 16px
            color: #fff
            line-height: 18px
            font-weight: bold
            margin-left: 6px
            vertical-align: top
        .description
          font-size: 12px
          font-weight: 200
          line-height: 12px
          margin: 8px 0 10px 0
        .support
          margin-bottom: 2px
          .icon
            display: inline-block
            width: 12px
            height: 12px
            background-size: 100%
            background-repeat: no-repeat
            &.decrease
              bg-image('img/decrease_1')
            &.discount
              bg-image('img/discount_1')
            &.guarantee
              bg-image('img/guarantee_1')
            &.invoice
              bg-image('img/invoice_1')
            &.special
              bg-image('img/special_1')
          .text
            display: inline-block
            vertical-align: top
            margin-left: 4px
            font-size: 10px
            font-weight: 200
            line-height: 12px
    .bulletin
      position: relative
      margin-top: 18px
      background-color: rgba(0,0,0,0.2)
      padding: 0 22px 0 12px
      height: 28px
      line-height: 28px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      .icon
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        background-size: 100%
        background-repeat: no-repeat
        bg-image('img/bulletin')
      .txt
        // 为什么设置了inlineblock 就省略号无效？？
        // 图片和文字都要设置 vertical-align:top，再修改图片 margintop 使之垂直居中
        vertical-align: top
        font-size: 10px
        margin: 0 4px
      .icon-chevron-right
        position: absolute
        right: 10px
        top: 8px
        font-size: 10px
    .support-count
      position:absolute
      right: 12px
      bottom: 62px
      font-size: 10px
      font-weight: 200
      line-height: 24px
      padding:0 8px
      background-color: rgba(0,0,0,0.2)
      border-radius: 14px
      text-align: center
      .icon-chevron-right
        margin-left: 2px
    .background-img img
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      backdrop-filter: blur(10px)
      z-index: -1
  .seller-detail
    position: fixed
    z-index: 100
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    overflow: auto
    background-color: rgba(7,17,27,0.8)
    .detial-wrapper
      box-sizing: border-box
      padding-top: 64px
      min-height: 100%
      color: #fff
      .txt-main
        padding-bottom: 64px
        text-align: center
        .name
          font-size: 16px
          font-weight: 700
          margin-bottom: 16px
        .title
          display: flex
          width: 80%
          margin: 30px auto 24px auto
          .line
            flex: 1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255,255,255,0.2)
          .txt
            padding: 0 12px
            font-size: 14px
        .supports-wrapper
          font-size: 0
          width: 80%
          margin: 0 auto
          text-align: left
          .support-item
            margin:0 0 12px 12px
            &:last-child
              margin-bottom: 0px
          .icon
            display: inline-block
            width: 16px
            height: 16px
            background-size: 100%
            background-repeat: no-repeat
            &.decrease
              bg-image('img/decrease_1')
            &.discount
              bg-image('img/discount_1')
            &.guarantee
              bg-image('img/guarantee_1')
            &.invoice
              bg-image('img/invoice_1')
            &.special
              bg-image('img/special_1')
          .txt
            display: inline-block
            vertical-align: top
            margin-left: 6px
            font-size: 12px
            font-weight: 200
            line-height: 16px
        .bulletin-wrapper
          width: 80%
          margin: auto
          text-align: left
          p
            font-size: 12px
            line-height: 24px
            font-weight: 200
    .close-btn
      color: rgba(255,255,255,0.5)
      text-align: center
      font-size: 32px
      margin-top: -64px
  // 定义动画 fade
  .fade-enter
    opacity: 0
  .fade-enter-to
    opacity: 1
  .fade-leave
    opacity: 1
  .fade-leave-to
    opacity: 0
  .fade-enter-active
    transition: opacity .5s
  .fade-leave-active
    transition: opacity .5s
</style>
