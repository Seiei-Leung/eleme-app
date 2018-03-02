<template>
  <div class="seller-component">
    <div class="sellerComponent" ref='sellerComponent'>
      <div class="sellerWrapper">
        <div class="seller-msg">
          <div class="top">
            <div class="left">
              <div class="name">
                {{seller.name}}
              </div>
              <div class="content">
                <div class="start-wrapper">
                  <v-star v-bind:size="36" v-bind:score="seller.score"></v-star>
                </div>
                <div class="count">
                  <span class="ratingCount">({{seller.ratingCount}})</span>
                  <span class="sellerCount">月售{{seller.sellCount}}单</span>
                </div>
              </div>
            </div>
            <div class="right" v-on:click='collect'>
              <span class="icon-heart" v-bind:class='{active : isCollect}'></span>
              <br />
              <span class="txt" v-show='!isCollect'>收藏</span>
              <span class="txt" v-show='isCollect'>已收藏</span>
            </div>
          </div>
          <div class="bottom">
            <div class="minPrice item">
              <span class="title">起送价</span>
              <span class="txt">{{seller.minPrice}}<span class="unit">元</span></span>
            </div>
            <div class="deliveryPrice item">
              <span class="title">商家配送</span>
              <span class="txt">{{seller.deliveryPrice}}<span class="unit">元</span></span>
            </div>
            <div class="deliveryTime item">
              <span class="title">平均配送时间</span>
              <br />
              <span class="txt">{{seller.delivery}}<span class="unit">分钟</span></span>
            </div>
          </div>
        </div>
        <div class="border">
        </div>
        <div class="announcement">
          <h1 class="title">
          公告与活动
        </h1>
          <div class="txt">
            {{seller.bulletin}}
          </div>
          <div class="supportWrapper">
            <ul>
              <li class="item" v-for='item in seller.support'>
                <span class="icon" v-bind:class="classMap[item.type]"></span>
                <span class="content">{{item.description}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="border">
        </div>
        <div class="seller-pic">
          <h1 class="title">
            商家实景
          </h1>
          <div class="pic-wrapper" ref='picWrapper'>
            <ul class="pic-list" ref='picList'>
              <li class="item" v-for='pic in seller.pics'>
                <img  class="pic" v-bind:src="pic">
              </li>
            </ul>
          </div>
        </div>
        <div class="border">
        </div>
        <div class="seller-details">
          <h1 class="title">
            商家信息
          </h1>
          <div class="details-list">
            <ul>
              <li class="details-item" v-for='item in seller.infos'>
                {{item}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <v-shopcart v-bind:minPrice="seller.minPrice" v-bind:deliveryPrice="seller.deliveryPrice" v-bind:selectFoods='selectFoods'></v-shopcart>
  </div>
</template>


<script type="text/javascript">
  import star from 'components/star/star';
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';

  export default {
    data: function() {
      return {
        classMap: ['decrease', 'special', 'discount', 'invoice', 'guarantee'],
        selectFoods: this.$store.state.selectFoods,
        isCollect: false
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'v-star': star,
      'v-shopcart': shopcart
    },
    created: function() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.sellerComponent, {
          click: true
        });
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.subscroll = new BScroll(this.$refs.picWrapper, {
            scrollX: true,
            eventPassthrough: 'vertical'
          });
        }
      });
    },
    methods: {
      collect: function(event) {
        if (!event._constructed) {
          return;
        }
        this.isCollect = !this.isCollect;
      }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .seller-component
    position: absolute
    top: 177px
    bottom: 46px
    width: 100%
    .sellerComponent
      width: 100%
      height: 100%
      overflow: hidden
      .seller-msg
        padding: 18px
        background-color: #fff
        .top
          padding-bottom: 18px
          overflow: hidden
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .left
            float: left
            .name
              font-size: 14px
              color: rgb(7, 17, 27)
            .content
              margin-top: 8px
              font-size: 0
              .start-wrapper
                display: inline-block
                vertical-align: top
              .count
                display: inline-block
                vertical-align: top
                font-size: 10px
                color: rgb(77, 85, 93)
                line-height: 18px
                .ratingCount
                  margin-left: 8px
                .sellCount
                  margin-left: 12px
          .right
            float: right
            width: 36px
            text-align: center
            font-size: 0
            .icon-heart
              font-size: 24px
              color: rgb(77, 85, 93)
              &.active
                color: rgb(240, 20, 20)
            .txt
              font-size: 10px
              color: rgb(77, 85, 93)
        .bottom
          display: flex
          justify-content: space-around
          padding-top: 18px
          .item
            flex: 1
            text-align: center
            font-size: 0
            border-right: 1px solid rgba(7, 17, 27, 0.1)
            &:last-child
              border-right: none
            .title
              display: block
              font-size: 10px
              color: rgb(147, 153, 159)
            .txt
              display: block
              margin-top: 4px
              font-size: 24px
              font-weight: 200
              color: rgb(7, 17, 27)
              .unit
                font-size: 10px
                color: rgb(147, 153, 159)
      .border
        height: 16px
        width: 100%
        background-color: #f3f5f7
        border-top: 1px solid rgba(7, 17, 27, 0.1)
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .announcement
        padding: 18px
        padding-bottom: 0
        .title
          font-size: 14px
          color: rgb(7, 17, 27)
        .txt
          margin-top: 8px
          padding: 0 12px
          padding-bottom: 16px
          font-size: 12px
          line-height: 24px
          font-weight: 200
          color: rgb(240, 20, 20)
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .supportWrapper
          .item
            padding: 16px 0px 16px 12px
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            font-size: 0
            &:last-child
              border-bottom: none
          .icon
            display: inline-block
            vertical-align: top
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
          .content
            display: inline-block
            margin-left: 6px
            line-height: 16px
            font-size: 12px
            font-weight: 200
            color: rgb(7, 17, 27)
      .seller-pic
        padding: 18px
        .title
          font-size: 14px
          color: rgb(7, 17, 27)
        .pic-wrapper
          box-sizing: border-box
          margin-top: 12px
          width: 100%
          font-size: 0
          white-space: nowrap
          overflow: hidden
          .pic-list
            .item
              display: inline-block
              margin-right: 6px
              width: 120px
              height: 90px
            .pic
              width: 100%
              height: 100%
      .seller-details
        padding: 18px
        .title
          font-size: 14px
          color: rgb(7, 17, 27)
        .details-list
          margin-top: 12px
          .details-item
            padding: 16px 12px 16px 12px
            font-size: 12px
            font-weight: 200
            line-height: 16px
            color: rgb(7, 17, 27)
            border-top: 1px solid rgba(7, 17, 27, 0.1)

</style>
