<template>
  <div class="save_msg-success" v-show="flag">
    <slot>{{text}}</slot>
 </div>
</template>

<script>
    export default {
        name: "save",
        props:{
          flag:{
            type:Boolean,
            default:true
          },
          text:{
            type:String,
            default:'信息保存成功'
          }
        },
        data(){
          return {}
        },
        methods:{
          
        }
    }
</script>

<style scoped>
  .save_msg-success {
      height: 292px;
      width: 210px;
      margin: 179px auto;
      padding-top: 240px;
      background:url(~@/assets/img/complete.png) no-repeat top center;
      background-size: 100% ;
      color: #D8BB7D;
      font-size: 34px;
  }
</style>
