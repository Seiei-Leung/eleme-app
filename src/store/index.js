import Vue from 'vue';
import Vuex from 'vuex';

// 全局使用vuex
Vue.use(Vuex);

// 初始化布尔值数据语义
const totalTag = true;
const affirmativeTag = false;
const passiveTag = false;

export default new Vuex.Store({
  state: {
    // 用于控制食物评论页面中的评论类型标签
    foodRatingTagsActive: [totalTag, affirmativeTag, passiveTag],
    foodRatingOnlyContent: false,
    // 用于主评论页面中的评论类型标签
    RatingPageTagsActive: [totalTag, affirmativeTag, passiveTag],
    RatingPageOnlyContent: false,
    // 用于不同路由共同使用的 购物车 组件
    selectFoods: []
  },
  mutations: {
    // 更改食物评论页面中的评论类型标签
    changefoodRatingTagsActive(state, num) {
      // 使用 Vuex 去监测数据，当数据是数组时，简单地改变数组的某一项内容，并无法触发信息双向绑定的效果，要把整个数组给更换掉
      state.foodRatingTagsActive = [false, false, false];
      state.foodRatingTagsActive[num] = true;
    },
    togglefoodRatingOnlyContent(state) {
      state.foodRatingOnlyContent = !state.foodRatingOnlyContent;
    },
    resetOnlyContent(state) {
      state.foodRatingOnlyContent = false;
    },
    // 更改主评论页面中的评论类型标签
    changeRatingPageTagsActive(state, num) {
      state.RatingPageTagsActive = [false, false, false];
      state.RatingPageTagsActive[num] = true;
    },
    toggleRatingPageOnlyContent(state) {
      state.RatingPageOnlyContent = !state.RatingPageOnlyContent;
    }
  }
});
