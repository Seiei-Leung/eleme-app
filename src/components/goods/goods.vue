<template>
  <div class="goods-component">
    <div class="left-bar" ref='leftBar'>
      <ul>
        <li class="goodTypeName" v-bind:class="{current: 0 === currentIndex}" v-on:click='selectMenu(0,$event)'>
          <span class="txt">
            热销榜
          </span>
        </li>
        <li v-for='goodtype,index in goods' class="goodTypeName" v-bind:class="{current: (index + 1) === currentIndex}" v-on:click='selectMenu((index + 1),$event)'>
          <span class="txt">
            <span v-if='goodtype.type > 0' v-bind:class='classMap[goodtype.type - 1]' class="icon"></span>{{goodtype.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="right-bar" ref='rightBar'>
      <ul>
        <li class="food-list food-list-hook">
          <h1 class="food-type">热销榜</h1>
          <ul>
            <li v-for='food in hotSellList' class="food-item" v-on:click='checkFood(food, $event)'>
              <div class="icon">
                <img width="57" height="57" v-bind:src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="sellcount">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now"><span style="font-size: 10px">￥</span>{{food.price}}</span>
                  <span class="old" v-if='food.oldPrice'>￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrappper">
                  <v-cartcontrol v-bind:food='food' v-on:setdropball='_dropball'></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li v-for='item in goods' class="food-list food-list-hook">
          <h1 class="food-type">{{item.name}}</h1>
          <ul>
            <li v-for='food in item.foods' class="food-item" v-on:click='checkFood(food, $event)'>
              <div class="icon">
                <img width="57" height="57" v-bind:src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="sellcount">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now"><span style="font-size: 10px">￥</span>{{food.price}}</span>
                  <span class="old" v-if='food.oldPrice'>￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrappper">
                  <v-cartcontrol v-bind:food='food' v-on:setdropball='_dropball'></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 购物车 -->
    <v-shopcart v-bind:minPrice="seller.minPrice" v-bind:deliveryPrice="seller.deliveryPrice" v-bind:selectFoods='selectFoods' ref='shopcart'></v-shopcart>
    <v-foodmsg v-bind:foodmsg="foodMsg" ref='foodmsg' v-on:setdropball='_dropball'></v-foodmsg>
  </div>
</template>


<script type="text/javascript">
  // 重点：使用 $refs 获取DOM元素，渲染DOM树后回调函数：$nextTick
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import foodmsg from 'components/foodmsg/foodmsg';
  import Vue from 'vue';

  const ERR_OK = 0;

  export default {
    props: ['seller'],
    components: {
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-foodmsg': foodmsg
    },
    data() {
      return {
        foodMsg: {},
        goods: [],
        classMap: ['decrease', 'special', 'discount'],
        foodItemHeights: [],
        scrollY: 0
      };
    },
    created: function() {
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          if (this.$store.state.selectFoods.length > 0) {
            this.goods.forEach((good) => {
              good.foods.forEach((food) => {
                this.$store.state.selectFoods.forEach((item) => {
                  if (item.name === food.name) {
                    Vue.set(food, 'count', item.count);
                  }
                });
              });
            });
          }
          // better-scroll 插件需要计算DOM高度
          // 即需要当DOM树渲染完成后，才能执行，所以单单只拿到数据还不行，还需要使用 $nextTick 实例方法
          this.$nextTick(() => {
            this._initScroll();
            this._getFoodListHeight();
          });
        };
      });
    },
    // 方法
    methods: {
      // 触发掉落小球, 模板绑定的事件无需传入参数！！！妈的
      _dropball(target) {
        // 触发购物车子组件方法，使用 $refs 取得组件实例，在直接调用其方法
        // 使用 $nextTick 是为性能优化，使按钮动画分开执行
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      // 初始化 better-scroll
      _initScroll() {
        this.leftBarScroll = new BScroll(this.$refs.leftBar, {
          click: true
        });
        this.rightBarScroll = new BScroll(this.$refs.rightBar, {
          click: true,
          probeType: 3
        });
        // 引用better-scroll接口绑定事件求出对应Y轴滚动坐标
        this.rightBarScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // 测出每一类别食品栏的高度，并保存在foodItemHeight中
      _getFoodListHeight() {
        let foodList = this.$refs.rightBar.getElementsByClassName('food-list-hook');
        let foodItemHeight = 0;
        this.foodItemHeights.push(foodItemHeight);
        for (let i = 0; i < foodList.length; i++) {
          foodItemHeight = foodList[i].clientHeight + foodItemHeight;
          this.foodItemHeights.push(foodItemHeight);
        }
      },
      // 使用点击标题时滚动到相应列表
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.rightBar.getElementsByClassName('food-list-hook');
        let currentFoodItem = foodList[index];
        this.rightBarScroll.scrollToElement(currentFoodItem, 300, 0, 1);
      },
      // 点击查看食物详情
      checkFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.foodMsg = food;
        this.$refs.foodmsg.showFoodMsg();
      }
    },
    // 计算属性
    computed: {
      currentIndex: function() {
        for (let i = 0; i < this.foodItemHeights.length; i++) {
          let height1 = this.foodItemHeights[i];
          let height2 = this.foodItemHeights[i + 1];
          // 注意下面的 !height2 ，以防去到末尾没有 height2 的值
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      // 提取已经选取得食物列表
      selectFoods: function() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      },
      // 提取热销榜
      hotSellList: function() {
        let hotSell = [];
        this.goods.forEach((item) => {
          item.foods.forEach((food) => {
            if (food.hotsell && food.hotsell === 1) {
              hotSell.push(food);
            }
          });
        });
        return hotSell;
      }
    },
    // 用于更新 vuex 已经选择的食物
    beforeRouteLeave: function(to, from, next) {
      this.$store.state.selectFoods = this.selectFoods;
      next();
    }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin.styl'

  .goods-component
    display: flex
    position: absolute
    top: 177px
    bottom: 46px
    width: 100%
    overflow: hidden
    .left-bar
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .goodTypeName
        display: table
        box-sizing: border-box
        height: 54px
        width: 100%
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          .txt
            font-weight: 700
            border-bottom: none
          background-color: #fff
        .icon
          display: inline-block
          margin-right: 2px
          width: 12px
          height: 12px
          background-size: 100%
          background-repeat: no-repeat
          &.decrease
            bg-image('img/decrease_3')
          &.discount
            bg-image('img/discount_3')
          &.special
            bg-image('img/special_3')
        .txt
          display: table-cell
          vertical-align: middle
          color: rgb(7, 17, 27)
          font-size: 12px
          font-weight: 200
          line-height: 14px
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child .txt
          border-bottom: none
    .right-bar
      flex: 1
      .food-list
        background-color: #fff
        .food-type
          padding-left: 12px
          color: rgb(147, 153, 159)
          background-color: #f3f5f7
          font-size: 12px
          line-height: 26px
          border-left: 2px solid #d9dde1
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            margin-bottom: 0
            border-bottom: none
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            position: relative
            flex: 1
            padding-top: 2px
            .name
              font-size: 14px
              color: rgb(7, 17, 27)
              margin-bottom: 8px
            .description, .extra
              font-size: 10px
              color: rgb(147, 153, 159)
              margin-bottom: 8px
            .extra
                font-size: 0px
                margin-bottom: 0
                .sellcount
                  font-size: 10px
                  margin-right: 10px
                .rating
                  font-size: 10px
            .price
              font-size: 0
              font-weight: 700
              height: 24px
              line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240, 20, 20)
              .old
                font-size: 10px
                color: rgb(147, 153, 159)
                text-decoration: line-through
            .cartcontrol-wrappper
              position: absolute
              bottom: -2px
              right: 0
</style>
