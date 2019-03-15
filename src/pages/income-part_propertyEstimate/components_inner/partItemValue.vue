<template>
   <div class="content__root" v-if="listArr&&listArr.length" >
     <div class="content__list-part"  v-for="(listItem,listIndex) in listArr" :key="listIndex" :data-id="listItem.ID" @click="toModifyLink(listItem)">
       <div class="content__list-part-item">
         {{listItem.type}}
       </div>
       <div class="content__list-part-item">
        <span class="part-item-value">
          {{listItem.amount}}
        </span>
         <i class="common-arrow-right"></i>
       </div>
     </div>
   </div>
</template>

<script>
    import Native from '@/common/native';
    export default {
        name: "partItemValue",
        props:{
          titleName:{
            type:String,
            default:''
          },
          amount:{
            type:String|Number,
            default:''
          },
          listArr:{
            type:Array,
            default:null
          },
          userGuid:{
            type:String
          }
        },
        methods:{
          toModifyLink(item){
            Native.NRouter.open({
              data:{
                type:'edit',
                propertyType:item.type,
                id:item.ID,
                userGuid:this.userGuid
              },
              url:'income-part_propertyEstimate-add.html'
            })

          }
        }
    }
</script>

<style lang="less">
  @MyFontSize:28px;
  .content__list-part{
    font-size: @MyFontSize;
    display: flex;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-bottom:1px solid #ddd;
  }
  .content__list-part-item{
    flex: 1;
    color:#999;
    position: relative;
  }
  .common-arrow-right{
    position: absolute;
    right:40px;
    top:20px;
    display: inline-block;
    width: 16px;
    height: 26px;
    background:url(../../../assets/img/next@2x.png) no-repeat;
    background-size:100%;
  }
  .part-item-value{
    display: inline-block;
    width: 100%;
  }
</style>
