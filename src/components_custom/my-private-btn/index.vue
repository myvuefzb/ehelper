<template>
  <button class="my-private-btn" :class="activeStatus?'btn-active-status':'btn-deactivate-status'" :disabled="!activeStatus" @click="btnHandle">
    <slot>{{text}}</slot>
  </button>
</template>

<script>
    export default {
        name: "myButton",
        model:{
          prop:'activeStatus'
        },
        props:{
          activeStatus:{
            type:Boolean,
            default:false
          },
          text:{
            type:String,
            default:''
          }
        },
        data(){
          return {}
        },
        methods:{
          btnHandle(){
            this.$emit('btn-event')
          }
        }
    }
</script>

<style scoped>
  .my-private-btn{
    width:80vw;
    height:80px;
    background: #44a4ef;
    border-radius:10px;
    line-height: 80px;
    color:#fff;
    font-size: 36px;
    text-align: center;
    border:none;
    margin-left:75px;
    margin-top:55px;
  }
  .btn-active-status{
    opacity:1;
  }
  .btn-deactivate-status{
    opacity:0.5;
  }
</style>
