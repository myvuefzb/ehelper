<template>
  <div class="income-part" v-if="creditFormObj">
    <my-line-input item-name="信用卡总额度:" v-model="creditFormObj.creditAmount" type="number"
                   @change="computeUsage(creditFormObj.usedAmount,creditFormObj.creditAmount)"
                   :left-text-width="120"></my-line-input>
    <my-line-input item-name="已用额度:" v-model="creditFormObj.usedAmount" type="number"
                   @change="computeUsage(creditFormObj.usedAmount,creditFormObj.creditAmount)"
                   :left-text-width="120"></my-line-input>
    <my-line-input item-name="使用率:" v-model="creditFormObj.usePercent"></my-line-input>
    <my-line-input item-name="近5年逾期次数:" v-model="creditFormObj.fiveyearsDelay" type="number"
                   :left-text-width="120"></my-line-input>
    <my-line-input item-name="当前是否逾期:" placeholder="点击选择" :left-text-width="120">
      <group>
        <popup-picker v-model="creditFormObj.isDelay" :data="creditFormObj.isDelayAttr" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <div class="shell"><span>信用贷款</span></div>
    <my-line-input item-name="信用贷款笔数:" v-model="creditFormObj.loanTimes" type="number" :left-text-width="120">
    </my-line-input>
    <my-line-input item-name="总金额:" v-model="creditFormObj.loanAmount" type="number"></my-line-input>
    <my-line-input item-name="剩余金额:" v-model="creditFormObj.leaveAmount" type="number"></my-line-input>

    <div class="shell"><span>征信查询</span></div>
    <my-line-input item-name="近一个月查询次数:" v-model="creditFormObj.oneQueryTimes" type="number"
                   :left-text-width="140"></my-line-input>
    <my-line-input item-name="近三个月查询次数:" v-model="creditFormObj.threeQueryTimes" type="number"
                   :left-text-width="140"></my-line-input>
    <my-line-input item-name="近半年查询次数:" v-model="creditFormObj.sixQueryTimes" type="number"
                   :left-text-width="140"></my-line-input>

  </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import {
    Group,
    PopupPicker,
    Datetime,
  } from 'vux';

  export default {
    name: "my-loan-form",
    components: {
      MyLineInput,
      Group,
      PopupPicker,
      Datetime,
    },
    props: {
      creditFormObj: {
        type: Object,
        default: null
      }
    },
    methods: {
      computeUsage(param1, param2) {
        if (param1 && param2) {
          this.creditFormObj.usePercent = (param1 * 1.0 / param2 * 1.0 * 100).toFixed(2) + '%';
        }
      }
    }
  }
</script>

<style scoped>

</style>
