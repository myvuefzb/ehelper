<template>
  <div class="popup-layout" v-if="show">
    <div class="popup-layout-mask"  >
    </div>
    <div class="popup-box">
      <div class="popup-box-header">
        {{title}}
      </div>
      <div class="popup-box-body">
        <div class="popup-box-main-text">
          {{mainTipsText}}
        </div>
      </div>
      <div class="popup-box-footer">
        <button type="button" class="btn-get-footer" @click="getReportEvent">{{buttonGetText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "popup",
        model:{
          prop:'show',
          event:'change'
        },
        props:{
          show:{
            type:Boolean,
            default:false
          },
          title:{
            type:String,
            default:'提示'
          },
          mainTipsText:{
            type:String,
            default: '您将进入银联页面进行银行卡验证，\n' +
              '验证成功后您将获得银联验证码，请\n' +
              '截屏或者手动记录下来，再回退到此\n' +
              '页面输入您获得的银联验证码！'
          },
          buttonGetText:{
            type:String,
            default:'去获取'
          }
        },
        data(){
          return {

          }
        },
        methods:{
          closeLayout(){
              this.$emit('change',!this.show)
          },
          getReportEvent(){
            this.$emit('btnEvent')

          }
        }
    }
</script>

<style scoped>
  .popup-layout{

  }
  .popup-layout-mask{
    position: fixed;
    top:0;
    width: 100vw;
    height:100vh;
    background: rgba(0, 0, 0, 0.5);
  }
  .popup-box{
    position: absolute;
    width:80vw;
    height:80vw;
    left:50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    background: #fff;
    border-radius:1vw;
  }
  .popup-box-header{
    height: 10vw;
    line-height: 10vw;
    text-align: center;
    font-size: 2rem;
    border-bottom:1px solid #ddd;
  }
  .popup-box-body{
    height: 60vw;
  }
  .popup-box-footer{
    border-top:1px solid #ddd;
    height: 10vw;
  }
  .btn-get-footer{
    width: 80vw;
    height: 10vw;
    font-size: 1em;
    border:none;
    background:none;
    color:#FB8046;
  }
  .popup-box-main-text{
    margin: 0 auto;
    font-size: 2.2rem;
    padding: 2rem;
    line-height: 1.9;
  }
</style>
