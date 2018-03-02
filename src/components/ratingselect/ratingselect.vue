<template>
  <div class="ratingselect-component">
    <div class="tag-names">
      <span class="tagname total" v-bind:class='{active: isActive[totalTag]}' v-on:click='changeActive(totalTag, $event)'>{{tagNames[totalTag]}}<span class="tagnum">{{totalCount}}</span></span>
      <span class="tagname affirmative" v-bind:class='{active: isActive[affirmativeTag]}' v-on:click='changeActive(affirmativeTag, $event)'>{{tagNames[affirmativeTag]}}<span class="tagnum">{{affirmativeCount}}</span></span>
      <span class="tagname passive" v-bind:class='{active: isActive[passiveTag]}' v-on:click='changeActive(passiveTag, $event)'>{{tagNames[passiveTag]}}<span class="tagnum">{{passiveCount}}</span></span>
    </div>
    <div class="selectHasContent" v-bind:class='{active: onlyContent}' v-on:click='changeOnlyContent'>
      <i class="icon-check_circle"></i><span class="txt">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/javascript">
  const totalTag = 0;
  const affirmativeTag = 1;
  const passiveTag = 2;

  export default {
    data: function() {
      return {
        totalTag: totalTag,
        affirmativeTag: affirmativeTag,
        passiveTag: passiveTag
      };
    },
    props: {
      // 传入的数值用于定义组件标签名
      tagNames: {
        type: Array,
        default: function() {
          return ['全部', '满意', '不满意'];
        }
      },
      // 传入的数值用于显示评论数
      ratings: {
        type: Array,
        default: function() {
          return [];
        }
      },
      // 传入的数值是 vuex 中的 布尔值数组，用于目前存储标签们的激活状态
      forActiveTag: {
        type: Array,
        required: true
      },
      // 传入的数值是 vuex 中定义改变标签激活状态的方法 事件名字
      forClickTag: {
        type: String,
        required: true
      },
      // 用于组件定义 是否只看内容 布尔值
      onlyContent: {
        type: Boolean,
        required: true
      },
      // 传入的数值是 vuex 中定义点击只看内容按钮的方法 事件名字
      forToggleOnlyContent: {
        type: String,
        required: true
      }
    },
    computed: {
      // 总评论数
      totalCount: function() {
        return this.ratings.length;
      },
      // 积极评论数
      affirmativeCount: function() {
        let count = 0;
        this.ratings.forEach((rating) => {
          if (rating.rateType === 0) {
            count += 1;
          }
        });
        return count;
      },
      // 消极评论数
      passiveCount: function() {
        return (this.totalCount - this.affirmativeCount);
      },
      // 使用 vuex
      isActive: function() {
        return this.forActiveTag;
      }
    },
    methods: {
      changeActive: function(num, event) {
        if (!event._constructed) {
          return;
        }
        this.$store.commit(this.forClickTag, num);
      },
      changeOnlyContent: function(event) {
        if (!event._constructed) {
          return;
        }
        this.$store.commit(this.forToggleOnlyContent);
      }
    }
  };
</script>

<style lang='stylus'>
  .ratingselect-component
    padding: 18px
    padding-bottom: 0
    border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    .tag-names
      font-size: 0
      .tagname
        display: inline-block
        vertical-align: top
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        font-size: 12px
        color: rgb(77, 85, 93)
        border-radius: 2px
        .tagnum
          margin-left: 4px
          font-size: 8px
      .total
        background-color: rgba(0, 160, 220, 0.2)
        &.active
          background-color: rgb(0, 160, 220)
          color: #fff
      .affirmative
        background-color: rgba(0, 160, 220, 0.2)
        &.active
          background-color: rgb(0, 160, 220)
          color: #fff
      .passive
        background-color: rgba(77, 85, 93, 0.2)
        &.active
          background-color: rgb(77, 85, 93)
          color: #fff
    .selectHasContent
      margin-top: 18px
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      padding: 12px 0
      color: rgb(147, 153, 159)
      line-height: 24px
      .icon-check_circle
        font-size: 24px
        vertical-align: top
      .txt
        margin-left: 4px
        font-size: 12px
        vertical-align: top
      &.active .icon-check_circle
        color: #00b43c
</style>
