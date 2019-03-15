<template>
  <div class="nodata" v-show="flag">
    <img src="@/assets/img/pic_zhanwei.png">
    <slot><div class="tips">{{text}}</div></slot>
 </div>
</template>

<script>
    export default {
        name: "nodata",
        props:{
          flag:{
            type:Boolean,
            default:true
          },
          text:{
            type:String,
            default:'暂无数据'
          }
        },
        data(){
          return {}
        },
        methods:{
          
        }
    }
</script>
<style lang='less' scoped>
.nodata{
  text-align: center;
  img{
    width:385px;
    height:337px;
    display: inline-block;
    margin-top:293px;
  }
  .tips{
    font-size:26px;
    color:rgba(0,0,0,1);
    margin-top:89px;
  }
}

</style>
