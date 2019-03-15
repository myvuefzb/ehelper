<template>
 <div class="credit-info" v-if="creditFormObj">
   <div class="shell"><span>信用贷款</span></div>
   <my-line-input item-name="信用卡总额度:" v-model="creditFormObj.creditAmount" :left-text-width="120"></my-line-input>
   <my-line-input item-name="已用额度:" v-model="creditFormObj.usedAmount" :isRequired="false" :left-text-width="120"> </my-line-input>
   <my-line-input item-name="使用率:" v-model="creditFormObj.usePercent" :is-required="false"></my-line-input>
   <my-line-input item-name="近5年逾期次数:" v-model="creditFormObj.fiveyearsDelay" :left-text-width="120"></my-line-input>
   <my-line-input item-name="当前是否逾期:" placeholder="点击选择" :left-text-width="120">
     <group>
       <popup-picker v-model="creditFormObj.isDelay" :data="creditFormObj.isDelayAttr" placeholder="点击选择"></popup-picker>
     </group>
   </my-line-input>
 </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import {
    Group,
    PopupPicker,
  } from 'vux';
    export default {
        name: "credit_info",
        components: {
          MyLineInput,
          Group,
          PopupPicker,
        },
        props:{
          creditFormObj:{
            type:Object,
            default:null
          },
          isNeedTitle:{
            type:Boolean,
            default:true
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
