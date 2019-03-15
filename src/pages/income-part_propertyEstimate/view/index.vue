<template>
  <div class="income-part">
    <div class="income-part-content">
        <part-title title-one="资产评估" title-two="资产金额(万)"></part-title>
        <div class="income-part-content__list" v-if="propertyObj">
           <part-list :list-arr="propertyObj.list" :user-guid="userGuid" v-if="propertyObj.list&&propertyObj.list.length"></part-list>
           <no-data v-else></no-data>
        </div>
   <!--   <div class="btn-group">
        <my-button :active-status="true" @btn-event="addPropertyEvent">添加</my-button>
      </div>-->
    </div>
  </div>
</template>
<script>
  import Native from '@/common/native';
  import MyLineInput from '@/components_custom/my-line-input';
  import MyButton from '@/components_custom/my-private-btn';
  import PartTitle from '../components_inner/partTitle'
  import PartList from '../components_inner/partItemValue';
  import {getParameter} from "../../../common/utils/url";
  import NoData from '@/components_custom/nodata'
  export default {
    components: {
      MyLineInput,
      MyButton,
      PartList,
      PartTitle,
      NoData
    },
    data() {
      return {
        propertyObj:null,
        userGuid:getParameter('userGuid'),
        dateInfoSource:getParameter('dateInfoSource')
      }
    },
    computed: {

    },
    methods: {
      localSave(key,value){
        let toString=Object.prototype.toString;
        let result=toString.call(value);
        if(value.toString()==='[object Object]'||result==='[object Array]'){
          localStorage.setItem(key,JSON.stringify(value))
        }else{
          localStorage.setItem(key,value)
        }


      },
      getCommonInfo(){
  /*      let loginInfo= localStorage.getItem('loginInfo');
        loginInfo=JSON.parse(loginInfo);
        if(!loginInfo){
          Native.NUI.tip({
            text:'No loginInfo'
          });
          return false;
        }*/
     /*   Native.NUI.tip({
          text:this.userGuid?this.userGuid:'No userGuid'
        });*/
        let userGuid=decodeURIComponent(this.userGuid);
        this.$axios({
          url:'/Apply/GetAPPASSET',
          method:'get',
          params:{
            CustomerGuid:userGuid
          },
          typeName:'85',
          showLoading:true,
        }).then((res)=>{
          let resData=res.data;
          if(resData.ResultType===0){
            let Model=resData.Model;
            this.propertyObj=resData.Model;
            this.localSave('myBuyHouseType',Model.BuyHouseType);
            this.localSave('myAssetsType',Model.AssetsType);
          }
        })
      },
      addPropertyEvent(){
        Native.NRouter.assign({
          data:{
            type:'insert',
            userGuid:decodeURIComponent(this.userGuid),
            dateInfoSource:this.dateInfoSource
          },
          url:'income-part_propertyEstimate-add.html'
        })
      },
      setHeader(){

        window.platformAdapter.addPropertyEstimateEvent= ()=>{
          this.addPropertyEvent();
        };
        Native.NUI.setHeader({
          isBack:true,
          title:'资产评估',
          rightText:'添加',
          rightTitle:'添加',
          rightCallback:'addPropertyEstimateEvent'
        })
      }
    },
    mounted() {
      this.setHeader();
      this.getCommonInfo()
    }
  }
</script>
<style lang='less'>
  @import '~@/styles/base.less';
</style>
