<template>
  <swipeout v-if="personInfo">
    <swipeout-item transition-mode="follow">
      <div slot="right-menu">
        <swipeout-button @click.native="onButtonClick" class="del-btn" type="warn">删除</swipeout-button>
      </div>
      <div class="my-contact-layout__list-item" slot="content" @click="onContentClick">
        <div class="my-contact-col-1 my-contact-col ">
          {{personInfo.name}}
        </div>
        <div class="my-contact-col-2 my-contact-col " v-html="formatPhone(personInfo.phoneNum)">
          <!--{{personInfo.phoneNum}}-->
        </div>
        <div class="my-contact-col-3 my-contact-col ">
          {{personInfo.relation}}
        </div>
        <div class="my-contact-col-4 my-contact-col ">
          {{personInfo.know}}
        </div>
        <i class="common-arrow-right"></i>
      </div>
    </swipeout-item>

  </swipeout>
</template>

<script>
  import {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  } from 'vux'
  import Native from '@/common/native';
  import {
    getParameter
  } from '@/common/utils/url';

  export default {
    name: "my-contact-list",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    props: {
      personInfo: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        maskStatus: true
      }
    },
    methods: {
      onButtonClick() {
        this.$emit("delContact")
      },
      handleEvents(type) {

      },
      onContentClick() {
        Native.NRouter.assign({
          data: {
            id: this.personInfo.id,
            CustomerGuid: getParameter('customerGuid')
          },
          url: 'income-part_addcontact.html'
        });
      },
      formatPhone(phone) {
        if (!phone)
          return false;
        let lstPhone = phone.split(',');
        if (lstPhone.length > 1)
          return '<p> ' + lstPhone[0] + '</p><p>' + lstPhone[1] + '</p>';
        else
          return '<p> ' + lstPhone[0] + '</p>';
      }
    }
  }
</script>

<style lang="less" scoped>
  @colHeight: 80px;

  .my-contact-col {
    //height: @colHeight;
    //line-height: @colHeight;
    text-align: center;
    font-size: 28px;
    word-break: break-all;
  }

  .my-contact-col-1 {
    flex: 2;
  }

  .my-contact-col-2 {
    flex: 4;
  }

  .my-contact-col-3 {
    flex: 3;
  }

  .my-contact-col-4 {
    flex: 3;
  }

  .my-contact-layout__list-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #ddd;

    .common-arrow-right {
      position: absolute;
      right: 40px;
      //top: 28px;
      display: inline-block;
      width: 16px;
      height: 26px;
      background: url(../../../assets/img/next@2x.png) no-repeat;
      background-size: 100%;
    }
  }

  .del-btn {
    font-size: 28px;
  }
</style>
