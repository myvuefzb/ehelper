<template>
  <div class="my-contact-layout__title">
    <div class="my-contact-col-1 my-contact-col my-contact-name">
      姓名
    </div>
    <div class="my-contact-col-2 my-contact-col my-contact-phone">
      手机号
    </div>
    <div class="my-contact-col-3 my-contact-col my-contact-relation">
      关系
    </div>
    <div class="my-contact-col-4 my-contact-col my-contact-know">
      是否知晓借款
    </div>
  </div>
</template>

<script>
    export default {
        name: "my-contact-title"
    }
</script>

<style lang="less" scoped>

  @colHeight:80px;

  .my-contact-layout__title{
    display: flex;
    height: @colHeight;
    line-height: @colHeight ;
    background: #eee;
  }
  .my-contact-col{
    height: @colHeight;
    line-height: @colHeight ;
    text-align: center;
    font-size: 28px;
  }
  .my-contact-col-1{
    flex: 2;
  }
  .my-contact-col-2{
    flex: 3;
  }
  .my-contact-col-3{
    flex: 2;
  }
  .my-contact-col-4{
    flex: 3;
  }
</style>
