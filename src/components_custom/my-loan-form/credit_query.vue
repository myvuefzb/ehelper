<template>
    <div class="credit-query" v-if="creditFormObj">
      <div class="shell"><span>征信查询</span></div>
      <my-line-input item-name="近一个月查询次数:" v-model="creditFormObj.oneQueryTimes" :left-text-width="140"></my-line-input>
      <my-line-input item-name="近三个月查询次数:" v-model="creditFormObj.threeQueryTimes" :left-text-width="140"></my-line-input>
      <my-line-input item-name="近半年查询次数:" v-model="creditFormObj.sixQueryTimes" :left-text-width="140"></my-line-input>
    </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  export default {
        name: "credit_query",
        components: {
          MyLineInput,
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
