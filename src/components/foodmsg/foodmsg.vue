<template>
  <transition name='move'>
    <div class="foodmsg-component" v-show='isShowFoodMsg' ref='foodmsgComponent'>
      <!-- 使用BScroll，用于挂载的父元素中只能含有一个子元素 -->
      <div class="foodmsg-container">
        <div class="img-header">
          <img class="image" v-bind:src="foodmsg.image">
          <div class="icon-navigate_before" v-on:click='hidFoodMsg'>
          </div>
        </div>
        <div class="food-header">
          <div class="title">
            {{foodmsg.name}}
          </div>
          <div class="sellStatus">
            <span class="sellCount">月售{{foodmsg.sellCount}}份</span>
            <span class="rating">好评率{{foodmsg.rating}}%</span>
          </div>
          <div class="foot">
            <div class="price">
              <span class="nowPrice"><span class="icon">￥</span>{{foodmsg.price}}</span>
              <span class="oldPrice" v-show='foodmsg.oldPrice'>￥{{foodmsg.oldPrice}}</span>
            </div>
            <div class="addFood">
              <div class="addCart" v-show='!foodmsg.count' v-on:click='addFood($event)'>加入购物车</div>
              <div class="cartcontrol-wrapper" v-show='foodmsg.count'>
                <v-cartcontrol v-bind:food='foodmsg' v-on:setdropball='_dropball'></v-cartcontrol>
              </div>
            </div>
          </div>
        </div>
        <div class="border"></div>
        <div class="food-description" v-show='foodmsg.info'>
          <div class="title">
            商品介绍
          </div>
          <div class="content">
            {{foodmsg.info}}
          </div>
        </div>
        <div class="border" v-show='foodmsg.info'></div>
        <div class="ratingselect-wrapper">
          <div class="title">
            商品评价
          </div>
          <v-ratingselect :ratings='foodmsg.ratings' :tagNames='tagNames' :forClickTag='forClickTag' :forActiveTag='forActiveTag' :onlyContent='onlyContent' :forToggleOnlyContent='forToggleOnlyContent'></v-ratingselect>
        </div>
        <div class="ratingsTxt">
          <div class="rating-item" v-for='rating in ratingsList'>
            <div class="header">
              <div class="time">{{ratingTime(rating.rateTime)}}</div>
              <div class="userInfo">
                <span class="userName">{{rating.userName}}</span>
                <img class="avatar" v-bind:src="rating.avatar">
              </div>
            </div>
            <div class="content">
              <i class="icon icon-thumb_down" v-show='rating.rateType === 1'></i><i class="icon icon-thumb_up" v-show='rating.rateType === 0'></i><span class="txt">{{rating.text}}</span>
            </div>
          </div>
          <div  class="noRating" v-show='ratingsList && ratingsList.length === 0'>
            暂无评论
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<script type="text/javascript">
  // 相对于本文件的路径!!!
  // 不添加花括号会报错，要么就使用 export default 语法输出，此时输出的数据类型是 对象。
  import {formatDate} from '../../common/js/date';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import ratingselect from 'components/ratingselect/ratingselect';
  import BScroll from 'better-scroll';
  import Vue from 'vue';

  export default {
    data() {
      return {
        isShowFoodMsg: false,
        tagNames: ['全部', '推荐', '吐槽'],
        forClickTag: 'changefoodRatingTagsActive',
        forToggleOnlyContent: 'togglefoodRatingOnlyContent'
      };
    },
    computed: {
      // 用于输送给子组件 ratingselect
      forActiveTag: function() {
        return this.$store.state.foodRatingTagsActive;
      },
      // 用于输送给子组件 ratingselect
      onlyContent: function() {
        return this.$store.state.foodRatingOnlyContent;
      },
      ratingsList: function() {
        // 储存筛选后的评论列表
        let ratingslist = [];
        // 要判断 foodmsg 是否为空，以防初始化报错
        if (this.foodmsg) {
          for (let i = 0; i < 3; i++) {
            if (this.$store.state.foodRatingTagsActive[i]) {
              // 激活 “全部” 状态
              if (i === 0) {
                // 查看所有评论(激活 “全部” 状态)
                if (!this.$store.state.foodRatingOnlyContent) {
                  return this.foodmsg.ratings;
                  // 查看只有内容的评论(激活 “全部” 状态)
                } else {
                  this.foodmsg.ratings.forEach((rating) => {
                    if (rating.text) {
                      ratingslist.push(rating);
                    }
                  });
                  return ratingslist;
                }
              } else {
                // 激活 “推荐” 或 “吐槽” 状态
                // 查看所有内容(激活 “推荐” 或 “吐槽” 状态)
                if (!this.$store.state.foodRatingOnlyContent) {
                  this.foodmsg.ratings.forEach((rating) => {
                    if (Number(rating.rateType) === (i - 1)) {
                      ratingslist.push(rating);
                    }
                  });
                  return ratingslist;
                  // 查看只有内容的评论(激活 “推荐” 或 “吐槽” 状态)
                } else {
                  this.foodmsg.ratings.forEach((rating) => {
                    if (Number(rating.rateType) === (i - 1) && rating.text) {
                      ratingslist.push(rating);
                    }
                  });
                  return ratingslist;
                }
              }
            }
          }
        }
      }
    },
    props: {
      foodmsg: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    methods: {
      // 给予父组件调用，用于显示本组件页面，
      showFoodMsg: function() {
        this.isShowFoodMsg = true;
        // 初始化 BScroll
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodmsgComponent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hidFoodMsg: function() {
        // 重置查看评论设置
        this.$store.commit('changefoodRatingTagsActive', 0);
        this.$store.commit('resetOnlyContent');
        this.isShowFoodMsg = false;
      },
      // cartcontrol 组件触发掉下小球动画
      _dropball: function(target) {
        this.$emit('setdropball', target);
      },
      // 购物车触发掉下小球动画
      addFood: function(event) {
        this.$emit('setdropball', event.target);
        // 延时，以防下掉小球动画没能读取购物车DOM元素位置
        setTimeout(() => {
          if (!this.foodmsg.count) {
            Vue.set(this.foodmsg, 'count', 1);
          } else {
            this.count = 1;
          }
        }, 100);
      },
      // 转化时间戳
      ratingTime: function(num) {
        let time = new Date(num);
        // let timeString = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes();
        let timeString = formatDate(time, 'yyyy-MM-dd hh:mm');
        return timeString;
      }
    },
    components: {
      'v-cartcontrol': cartcontrol,
      'v-ratingselect': ratingselect
    }
  };
</script>

<style lang="stylus" rel='stylesheet/stylus'>
  .move-enter
    transform: translate3d(100%, 0, 0)
  .move-enter-to
    transform: translate3d(0, 0, 0)
  .move-leave-to
    transform: translate3d(100%, 0, 0)
  .move-leave
    transform: translate3d(0, 0, 0)
  .move-enter-active
    transition: all .3s linear
  .move-leave-active
    transition: all .3s linear
  .foodmsg-component
    position: fixed
    top: 0
    bottom: 48px
    width: 100%
    overflow: hidden
    background-color: #fff
    z-index: 30
    .img-header
      position: relative
      width: 100%
      padding-top: 100%
      .image
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .icon-navigate_before
        position: absolute
        top: 10px
        left: 10px
        width: 30px
        height: 30px
        line-height: 30px
        text-align: center
        font-size: 20px
        border-radius: 50%
        background-color: rgba(0, 0, 0, 0.5)
        color: #fff
    .food-header
      padding: 18px
      .title
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .sellStatus
        margin-top: 8px
        font-size: 0
        .sellCount, .rating
          display: inline-block
          font-size: 10px
          color: rgb(147, 153, 159)
        .rating
          margin-left: 12px
      .foot
        margin-top: 18px
        overflow: hidden
        .price
          float: left
          .nowPrice
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
            line-height: 24px
            .icon
              font-size: 10px
              font-weight: normal
          .oldPrice
            text-decoration: line-through
            font-size: 10px
            font-weight: 700
            color: rgb(147, 153, 159)
            line-height: 24px
            .icon
              font-weight: normal
        .addFood
          float: right
          .addCart
            padding: 6px 12px
            line-height: 12px
            font-size: 10px
            border-radius: 12px
            color: #fff
            background-color: rgb(0, 160, 220)
    .border
      height: 16px
      width: 100%
      background-color: #f3f5f7
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    .food-description
      padding: 18px
      .title
        font-size: 14px
        color: rgb(7, 17, 27)
      .content
        padding: 6px 8px 0 8px
        font-size: 12px
        font-weight: 200
        color: rgb(77, 85, 93)
        line-height: 24px
    .ratingselect-wrapper
      .title
        padding: 18px 18px 0 18px
        font-size: 14px
        color: rgb(7, 17, 27)
    .ratingsTxt
      padding: 0 18px
      .rating-item
        padding: 18px 0
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border-bottom: none
        .header
          overflow: hidden
          font-size: 0
          .time
            float: left
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px
          .userInfo
            float: right
            font-size: 0
            .userName
              display: inline-block
              vertical-align: top
              margin-right: 6px
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 12px
            .avatar
              display: inline-block
              vertical-align: top
              width: 12px
              height: 12px
              border-radius: 50%
        .content
          margin-top: 6px
          font-size: 12px
          .icon
            line-height: 24px
            margin-right: 4px
          .icon-thumb_down
            color: rgb(147, 153, 159)
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .txt
            color: rgb(7, 17, 27)
            line-height: 16px
      .noRating
        padding: 18px 0
        line-height: 16px
        color: rgb(7, 17, 27)
        text-align: center
</style>
