<template>
  <div class="income-part-content__title">
    <div class="income-part-content__title-part">
      {{titleOne}}
    </div>
    <div class="income-part-content__title-part">
      {{titleTwo}}
    </div>
  </div>
</template>
<script>
  export default {
    name: "partTitle",
    props: {
      titleOne: {
        type: String
      },
      titleTwo: {
        type: String
      }
    }
  }
</script>

<style lang="less">
  @MyFontSize: 28px;
  .income-part-title {
    height: 40px;
    line-height: 40px;
    background: #44a4ef;
  }

  .income-part-content__title {
    font-size: @MyFontSize;
    display: flex;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #666;
    background: #eee;
  }

  .income-part-content__title-part {
    flex: 1;
  }
</style>
