<template>
  <div v-bind:class="starType" class="star">
    <!-- 同一个元素绑定多个 className 时，需要传入一个对象 -->
    <span v-for="classitem in classitems" v-bind:class="classitem" class="star-item" ></span>
  </div>
</template>

<script type="text/javascript">
  // 不能定义在 export default 中，需要放到顶层作用域中
  const CLS_ON = 'on';
  const CLS_OFF = 'off';
  const CLS_HALF = 'half';
  const LENGTH = 5;

  export default {
    props: ['score', 'size'],
    computed: {
      // 计算星星的等级
      classitems: function() {
        // 把分数换算成整数或整数半的状态
        let score = Math.floor(this.score * 2) / 2;
        let results = [];
        // 测试是否有半星的情况
        let hasHalfStar = (score % 1 !== 0);
        // 读取整数星星个数
        let intScore = Math.floor(score);
        // 输出类对象
        for (var i = 0; i < intScore; i++) {
          results.push(CLS_ON);
        };
        if (hasHalfStar) results.push(CLS_HALF);
        while (results.length < LENGTH) {
          results.push(CLS_OFF);
        };
        return results;
      },
      // 导进星星的大小
      starType: function() {
        return 'star' + this.size;
      /* eslint-disable semi */
      }
    }
  }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin.styl'

// 注意 & 的使用位置，指向的是垂直方向左上一位的对齐的元素
  .star
    font-size: 0
    .star-item
      display: inline-block
      backgound-repeat: no-repeat
    &.star48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0px
        &.on
          bg-image('img/star48_on')
        &.off
          bg-image('img/star48_off')
        &.half
          bg-image('img/star48_half')
    &.star36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0px
        &.on
          bg-image('img/star36_on')
        &.off
          bg-image('img/star36_off')
        &.half
          bg-image('img/star36_half')
    &.star24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0px
        &.on
          bg-image('img/star24_on')
        &.off
          bg-image('img/star24_off')
        &.half
          bg-image('img/star24_half')

</style>
