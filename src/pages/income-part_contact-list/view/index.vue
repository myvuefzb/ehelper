<template>
  <div class="income-part">
    <!--<div class="income-part-title">-->

    <!--</div>-->
    <div class="my-contact-layout">
      <my-contact-title></my-contact-title>
      <div class="my-contact-layout__content" v-if="listArr && listArr.length>0">
        <my-contact-list v-for="(listItem,listIndex) in listArr" :key="listIndex" :person-info="listItem"
                         @delContact="revDelContact(listItem.id)"></my-contact-list>
      </div>
      <div class="my-contact-layout__content" v-if="listArr && listArr.length==0">
        <nodata></nodata>
      </div>
    </div>
    <!--<div class="shell">-->
    <!--&lt;!&ndash; <button class="delBtn" @click="delBtnEvent">保存</button> &ndash;&gt;-->
    <!--<button class="delBtn" @click="addBtnEvent">添加</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import MyContactTitle from '../components_inner/my-contact-title';
  import MyContactList from '../components_inner/my-contact-list';
  import Native from '@/common/native';
  import {getParameter} from '@/common/utils/url';
  import nodata from '@/components_custom/nodata';

  export default {
    name: "my-contact-layout",
    components: {
      MyContactTitle,
      MyContactList,
      nodata
    },
    data() {
      return {
        listArr: null,
        userLoginInfo: {}
      }
    },
    methods: {
      getLoginInfo() {
        let loginInfo = localStorage.getItem('loginInfo');
        if (loginInfo) {
          loginInfo = JSON.parse(loginInfo);
          this.userLoginInfo = loginInfo
        } else {
          Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
        }
      },
      getContractList() { //获取联系人列表
        let sendData = {
          CustomerGuid: getParameter('customerGuid')
        };
        this.$axios({
          method: 'get',
          url: '/Apply/GetAppContacts',
          params: sendData,
          typeName: '85',
          showLoading: true
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            if (success.data.Model && success.data.Model.Result && success.data.Model.Result.rows && success.data.Model.Result.rows.length) {
              this.listArr = success.data.Model.Result.rows.map(function (item) {
                let contact = {
                  id: item.ID,
                  name: item.FULL_NAME,
                  phoneNum: item.PHONE_NO,
                  relation: item.RELATIONDESC,
                  know: item.IS_KNOW_LOANDESC
                }
                return contact;
              });
            } else {
              this.listArr = [];
            }

            // Native.NRouter.open({
            //     url: 'income-part_contact-list.html'
            // });
          }
        });
      },
      revDelContact(delIds) {
        let sendData = {
          Ids: delIds,
          CREATE_USER_ID: this.userLoginInfo.UserGuid
        };
        this.$axios({
          method: 'get',
          url: '/Apply/DeleteContact',
          params: sendData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            let tt = this.listArr.findIndex(value => value.id === delIds);
            this.listArr.splice(tt, 1);
            // Native.NRouter.open({
            //     url: 'income-part_contact-list.html'
            // });
          }
        });
      },
      addBtnEvent() {
        Native.NRouter.open({
          data: {
            customerGuid: getParameter('customerGuid')
          },
          url: 'income-part_addcontact.html'
        });
      },
      setHeader() {
        window.platformAdapter.contractListBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '联系人信息',
          isBack: true,
          rightTitle: '添加',
          rightText: '添加',
          rightCallback: 'contractListBtnEvent'
        })
      }
    },
    created() {
      // this.setLoginInfo();/**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getContractList();
      this.setHeader();
    }
  }
</script>

<style lang="less">
  @import '~@/styles/base.less';

  .income-part {
  }

  .income-part-title {
    height: 40px;
    line-height: 40px;
    background: #44a4ef;
  }

  .shell {
    line-height: 22vw;
    text-align: center;
  }

  .delBtn {
    width: 35vw;
    height: 7vw;
    border: 0px;
    color: white;
    border-radius: 15px;
    text-align: center;
    background: #44a4ef;
    font-size: 3.733vw;
  }
</style>
