<template>
  <div class="credit-loan" v-if="creditFormObj">
    <div class="shell"><span>信用贷款</span></div>
    <my-line-input item-name="信用贷款笔数:" :left-text-width="120">
      <group>
        <popup-picker v-model="creditFormObj.loanTimes" :data="creditFormObj.loanTimesAttr" placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="总金额:" v-model="creditFormObj.loanAmount" :is-required="false"></my-line-input>
    <my-line-input item-name="剩余金额:" v-model="creditFormObj.leaveAmount" :isRequired="false"></my-line-input>
  </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import {
    Group,
    PopupPicker,
  } from 'vux';

  export default {
    name: "credit_loan",
    components: {
      MyLineInput,
      Group,
      PopupPicker,
    },
    props: {
      creditFormObj: {
        type: Object,
        default: null
      },
      isNeedTitle: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style scoped>
  .shell {
    width: 100%;
    line-height: 200%;
    text-align: center;
    background: rgba(239, 239, 244, 1);
    font-size: 3.733vw;
  }
</style>
