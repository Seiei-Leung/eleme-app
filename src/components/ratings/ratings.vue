<template>
  <div class="ratings-component">
    <!--
      为什么 ref='ratingsComponent' 不直接放置在最外层div上
      因为如果放置在最外层，点击购物车弹出模拟层滚动时背景也会随之滚动
    -->
    <div class="ratingsComponent" ref='ratingsComponent'>
      <div class="ratings-wrapper">
        <div class="score-wrapper">
          <div class="left">
            <div class="score">
              {{seller.score}}
            </div>
            <div class="title">
              综合评分
            </div>
            <div class="txt">
              高于周边商家{{seller.rankRate}}
            </div>
          </div>
          <div class="right">
            <div class="attitude-star">
              <div class="txt">服务态度</div>
              <div class="star-wrapper">
                <v-star v-bind:size='36' v-bind:score='seller.serviceScore'></v-star>
              </div>
              <div class="score">
                {{seller.serviceScore}}
              </div>
            </div>
            <div class="foodrating-star">
              <div class="txt">出品评价</div>
              <div class="star-wrapper">
                <v-star v-bind:size='36' v-bind:score='seller.foodScore'></v-star>
              </div>
              <div class="score">
                {{seller.foodScore}}
              </div>
            </div>
            <div class="delivery-time">
              <span class="txt">送达时间</span>
              <span class="time">{{seller.delivery}}分钟</span>
            </div>
          </div>
        </div>
        <div class="border">
        </div>
        <div class="ratingselect-wrapper">
          <v-ratingselect :ratings='ratings' :tagNames='tagNames' :forClickTag='forClickTag' :forActiveTag='forActiveTag' :onlyContent='onlyContent' :forToggleOnlyContent='forToggleOnlyContent'></v-ratingselect>
        </div>
        <div class="ratingsTxt">
          <div class="noRating" v-show='ratingsList && ratingsList.length === 0'>
            暂无评论
          </div>
          <div class="rating-item" v-for='rating in ratingsList'>
            <div class="top">
              <div class="avatar">
                <img class="avatar-img" v-bind:src="rating.avatar">
              </div>
              <div class="left">
                <div class="name">
                  {{rating.userName}}
                </div>
                <div class="msg">
                  <div class="star-wrapper">
                    <v-star v-bind:size='24' v-bind:score='rating.score'></v-star>
                  </div>
                  <div class="delivery-time" v-if='rating.deliveryTime'>
                    {{rating.deliveryTime}}分钟送达
                  </div>
                </div>
              </div>
              <div class="right">
                {{ratingTime(rating.rateTime)}}
              </div>
            </div>
            <div class="txt">
              {{rating.text}}
            </div>
            <div class="bottom">
              <i class="icon icon-thumb_down" v-show='rating.rateType === 1'></i><i class="icon icon-thumb_up" v-show='rating.rateType === 0'></i>
              <span class="recommend" v-if='rating.recommend.length>0' v-for='item in rating.recommend'>
                {{item}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-shopcart v-bind:minPrice="seller.minPrice" v-bind:deliveryPrice="seller.deliveryPrice" v-bind:selectFoods='selectFoods'></v-shopcart>
  </div>
</template>



<script type="text/javascript">
  import star from 'components/star/star';
  import ratingselect from 'components/ratingselect/ratingselect';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date';
  import shopcart from 'components/shopcart/shopcart';

  const ERR_OK = 0;

  export default {
    data: function() {
      return {
        ratings: [],
        tagNames: ['全部', '满意', '不满意'],
        forClickTag: 'changeRatingPageTagsActive',
        forToggleOnlyContent: 'toggleRatingPageOnlyContent',
        selectFoods: this.$store.state.selectFoods
      };
    },
    computed: {
      forActiveTag: function() {
        return this.$store.state.RatingPageTagsActive;
      },
      onlyContent: function() {
        return this.$store.state.RatingPageOnlyContent;
      },
      ratingsList: function() {
        // 储存筛选后的评论列表
        let ratingslist = [];
        // 要判断 ratings 是否为空，以防初始化报错
        if (this.ratings) {
          for (let i = 0; i < 3; i++) {
            if (this.$store.state.RatingPageTagsActive[i]) {
              // 激活 “全部” 状态
              if (i === 0) {
                // 查看所有评论(激活 “全部” 状态)
                if (!this.$store.state.RatingPageOnlyContent) {
                  return this.ratings;
                  // 查看只有内容的评论(激活 “全部” 状态)
                } else {
                  this.ratings.forEach((rating) => {
                    if (rating.text) {
                      ratingslist.push(rating);
                    }
                  });
                  return ratingslist;
                }
              } else {
                // 激活 “推荐” 或 “吐槽” 状态
                // 查看所有内容(激活 “推荐” 或 “吐槽” 状态)
                if (!this.$store.state.RatingPageOnlyContent) {
                  this.ratings.forEach((rating) => {
                    if (Number(rating.rateType) === (i - 1)) {
                      ratingslist.push(rating);
                    }
                  });
                  return ratingslist;
                  // 查看只有内容的评论(激活 “推荐” 或 “吐槽” 状态)
                } else {
                  this.ratings.forEach((rating) => {
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
    created: function() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
        }
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratingsComponent, {
            click: true
          });
        });
      });
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      'v-star': star,
      'v-ratingselect': ratingselect,
      'v-shopcart': shopcart
    },
    methods: {
      // 转化时间戳
      ratingTime: function(num) {
        let time = new Date(num);
        // let timeString = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes();
        let timeString = formatDate(time, 'yyyy-MM-dd hh:mm');
        return timeString;
      }
    }
};
</script>

<style lang='stylus'>
  .ratings-component
    position: absolute
    top: 177px
    bottom: 46px
    width: 100%
    .ratingsComponent
      width: 100%
      height: 100%
      overflow: hidden
      .score-wrapper
        display: flex
        padding: 16px 0
        background-color: #fff
        .left
          flex: 0 0 134px
          box-sizing: border-box
          width: 134px
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          .score
            font-size: 24px
            color: rgb(255, 153, 0)
            line-height: 28px
          .title
            margin: 6px 0 8px 0
            font-size: 12px
            color: rgb(7, 17, 27)
          .txt
            margin-bottom: 6px
            font-size: 10px
            color: rgb(147, 153, 159)
        .right
          flex: 1
          padding-left: 24px
          .txt
            margin-right: 12px
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-top: 1px
            display: inline-block
            vertical-align: top
          .score
            margin-left: 12px
            display: inline-block
            vertical-align: top
            line-height: 18px
            font-size: 12px
            color: rgb(255, 153, 0)
          .attitude-star, .foodrating-star
            margin-bottom: 8px
            font-size: 0
          .delivery-time
            font-size: 0
            .time
              line-height: 18px
              vertical-align: top
              font-size: 12px
              color: rgb(147, 153, 159)
      .border
        height: 16px
        width: 100%
        background-color: #f3f5f7
        border-top: 1px solid rgba(7, 17, 27, 0.1)
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .ratingsTxt
        padding: 0 18px
        .rating-item
          padding: 18px 0
          font-size: 0
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .top
            overflow: hidden
            .avatar
              float: left
              width: 28px
              height: 28px
              .avatar-img
                width: 100%
                height: 100%
                border-radius: 50%
            .left
              float: left
              margin-left: 12px
              .name
                font-size: 10px
                color: rgb(7, 17, 27)
                line-height: 12px
              .msg
                margin: 4px 0 6px 0
                .star-wrapper
                  display: inline-block
                  vertical-align: top
                .delivery-time
                  margin-left: 6px
                  display: inline-block
                  vertical-align: top
                  font-size: 10px
                  font-weight: 200
                  color: rgb(147, 153, 159)
                  line-height: 12px
            .right
              float: right
              font-size: 10px
              font-weight: 200
              color: rgb(147, 153, 159)
              line-height: 12px
          .txt
            margin-left: 40px
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 18px
          .bottom
            margin:8px 0 0 40px
            .icon
              font-size: 12px
              line-height: 16px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(183, 187, 191)
            .recommend
              margin-left: 8px
              display: inline-block
              vertical-align: top
              padding: 0 6px
              max-width: 65px
              line-height: 16px
              text-align: center
              font-size: 9px
              color: rgb(147, 153, 159)
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
        .rating-item:last-child
          border-bottom: none
        .noRating
          padding: 18px 0
          line-height: 16px
          color: rgb(7, 17, 27)
          text-align: center
</style>
