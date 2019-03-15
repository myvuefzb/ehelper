<template>
  <div class="income-part">
    <!--<div class="income-part-title">-->

    <!--</div>-->
    <transition>
      <credit-all :creditFormObj="formObj"></credit-all>
    </transition>
    <my-line-input item-name="工作性质:">
      <group v-if="formObj.workPropertyAttr.length">
        <popup-picker v-model="formObj.workProperty" :data="formObj.workPropertyAttr" :columns="1" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>

    <div class="shell"><span>同行信息</span></div>
    <my-line-input item-name="单位名称:">
      <group v-if="formObj.companyNameAttr.length">
        <popup-picker v-model="formObj.companyName" :data="formObj.companyNameAttr" show-name
                      placeholder="点击选择"></popup-picker>
      </group>
    </my-line-input>
    <my-line-input item-name="产品名称:" v-model="formObj.productName" :is-required="false"></my-line-input>
    <my-line-input item-name="产品期数:" v-model="formObj.durationTime" type="number"></my-line-input>
    <my-line-input item-name="已还期数:" v-model="formObj.repayDuration" type="number"></my-line-input>
    <my-line-input item-name="月还款金额:" v-model="formObj.repayAmount" type="number"></my-line-input>
    <my-line-input item-name="终审决议:" v-model="formObj.finalResult" :is-required="false"></my-line-input>
    <my-line-input item-name="到账金额:" v-model="formObj.arrivalAmount" type="number"></my-line-input>
    <my-line-input item-name="产品费率:" v-model="formObj.rate" type="number" :is-required="false"></my-line-input>
    <div class="confirm-layout" v-transfer-dom>
      <confirm v-model="showConfirm" confirm-text="需要" cancel-text="不需要" @on-confirm="onConfirm" @on-cancel="onCancel">
        <p style="text-align:center;">您还未保存，是否需要保存填写内容？</p>
      </confirm>
    </div>
    <!--<div class="shell">-->
      <!--<button class="delBtn" @click="addBtnEvent">保存</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import MyLineInput from '@/components_custom/my-line-input';
  import {getParameter} from '@/common/utils/url';
  import {guid} from '@/common/utils/guid';
  import {CreditAll} from '@/components_custom/my-loan-form/index';
  import {Confirm, Datetime, Group, PopupPicker, TransferDomDirective as TransferDom} from 'vux';
  import {strategy, Valitor} from '@/common/validForm';
  import Native from '@/common/native';

  export default {
    directives: {
      TransferDom
    },
    components: {
      MyLineInput,
      Group,
      PopupPicker,
      Datetime,
      CreditAll,
      Confirm
    },
    data() {
      return {
        showConfirm: false,
        formObj: {
          creditAmount: '',
          usedAmount: '',
          usePercent: '',
          fiveyearsDelay: '',
          isDelay: [],
          isDelayAttr: [
            [{
              name: '是',
              value: '1'
            }, {
              name: '否',
              value: '0'
            }]
          ],
          workProperty: [],
          workPropertyAttr: [{
            name: '上班',
            value: '1'
          }, {
            name: '私营业主',
            value: '2'
          }, {
            name: '自雇人士',
            value: '3'
          }],
          loanTimes: '',
          loanAmount: '',
          leaveAmount: '',
          oneQueryTimes: '',
          threeQueryTimes: '',
          sixQueryTimes: '',
          companyName: [],
          companyNameAttr: [],
          productName: '',
          durationTime: '',
          arrivalAmount: '',
          repayDuration: '',
          repayAmount: '',
          finalResult: '',
          rate: ''
        },
        userLoginInfo: {},
        applyGuid: '',
        quickLoan: {},
        partnerInfo: {},
        nowTime: new Date(),
        customerUserGuid: getParameter('userGuid'),
        realName: getParameter('realName'),
        cardNo: getParameter('cardNo'),
        dateInfoSource: getParameter('dateInfoSource'), // 是否是恒e家的数据1为是，否则否
        slotProps: {
          tempest: 10
        }
      }
    },
    computed: {
      startTime() {
        let nowTime = this.nowTime;
        let startYear = nowTime.getFullYear() - 40;
        let timeDate = new Date(startYear + '');
        let timeStr = timeDate.toISOString().slice(0, 10);
        return timeStr
      },
      endTime() {
        let nowTime = this.nowTime;
        let timeStr = nowTime.toISOString();
        return timeStr.slice(0, 10)
      },
    },
    methods: {
      showSave() {
        this.showConfirm = true;
      },
      onConfirm() {
        this.addBtnEvent();
      },
      //
      onCancel() {
        Native.NRouter.back();
      },
      toSuccessLink(option) {
        let assignObj = {
          url: 'save-success.html'
        };
        let openObj = option ? Object.assign(assignObj, option) : assignObj;
        Native.NRouter.assign(openObj)
      },
      getLoginInfo() {
        let loginInfo = localStorage.getItem('loginInfo');
        if (loginInfo) {
          loginInfo = JSON.parse(loginInfo);
          this.userLoginInfo = loginInfo
        } else {
          Native.NRouter.getUserLoginInfo({'callback': 'getUserLoginInfo'});
        }
      },
      //同行信息
      getCompanyName() {
        this.$axios({
          url: '/Apply/GetPubcodeInfos',
          params: {
            code: 'CounterpartUnits'
          },
          method: 'Get',
          typeName: '85'
        }).then((success) => {
          this.formObj.companyNameAttr.push(success.data.Model.map(function (item) {
            let tt = {
              name: item.Name,
              value: item.Guid
            };
            return tt;
          }));
        });
      },
      getQuickLoan() {
        this.applyGuid = getParameter('applyGuid');
        let sendData = {
          loan_TypeGuid: getParameter('loanTypeGuid'),
          apply_Guid: getParameter('applyGuid')
        };
        this.$axios({
          method: 'get',
          url: '/Apply/GetAPPEliteCreditApply',
          params: sendData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            if (success.data.Model != undefined) {
              if (success.data.Model != null) {
                let quick = success.data.Model;
                this.quickLoan = quick;
                this.formObj.creditAmount = quick.CREDITCARDQUOTA;
                this.formObj.usedAmount = quick.CREDITCARDUSEDMOUNT;
                this.formObj.usePercent = quick.CREDITCARDUSERATE + '%';
                this.formObj.isDelay.push(quick.ISHAVEOVERDUEOFCREDITCARD);
                this.formObj.fiveyearsDelay = quick.CREDITCARDOVERDUETIMES;
                this.formObj.loanAmount = quick.CREDITLOANAMOUNT;
                this.formObj.leaveAmount = quick.CREDITLOANBANLANCE;
                this.formObj.workProperty.push(quick.WORKNATURE + '');
                this.formObj.loanTimes = quick.CREDITLOANTIMES;
                this.formObj.oneQueryTimes = quick.QUERYTIMESOFMONTH;
                this.formObj.threeQueryTimes = quick.QUERYTIMESOFTHREEMONTH;
                this.formObj.sixQueryTimes = quick.QUERYTIMESOFHALFYEAR;
                //查询同行信息
                this.$axios({
                  method: 'get',
                  url: '/Apply/GetAPPCounterpartInforList',
                  params: {
                    ElitecreditGuid: quick.GUID
                  },
                  typeName: '85'
                }).then((success) => {
                  if (success && success.data.ResultType === 0) {
                    if (success.data.Model.list.length > 0) {
                      let partner = success.data.Model.list[0];
                      this.partnerInfo = partner;
                      this.formObj.arrivalAmount = partner.ARRIVAL_AMOUNT;
                      this.formObj.companyName.push(partner.COUN_NAME_GUID);
                      this.formObj.durationTime = partner.PRO_ISSUE;
                      this.formObj.productName = partner.PRO_NAME;
                      this.formObj.repayDuration = partner.REPAID_PERIOD;
                      this.formObj.repayAmount = partner.PER_AMOUNT;
                      this.formObj.finalResult = partner.CONTRACT_AMOUNT;
                      this.formObj.rate = partner.ProductRate;
                    }
                  }
                });
              }
            }
          }
        });
      },
      validAll() {
        let msgNot = '请填写';
        let selectNot = '请选择';
        let numOver = '字数超出50限制';
        let formatError = '格式有误';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.formObj.creditAmount, msgNot + '信用卡总额度'));
        validObj.add(strategy.isNotEmpty(this.formObj.usedAmount, msgNot + '已用额度'));
        validObj.add(strategy.isNotEmpty(this.formObj.usePercent, msgNot + '使用率'));
        validObj.add(strategy.isNotEmpty(this.formObj.fiveyearsDelay, msgNot + '近五年逾期次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.isDelay, selectNot + '当前是否逾期'));
        validObj.add(strategy.isNotEmpty(this.formObj.loanTimes, msgNot + '信用贷款笔数'));
        validObj.add(strategy.isNotEmpty(this.formObj.loanAmount, msgNot + '总金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.leaveAmount, msgNot + '剩余金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.oneQueryTimes, msgNot + '近一个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.threeQueryTimes, msgNot + '近三个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.sixQueryTimes, msgNot + '近半年查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.workProperty, msgNot + '工作性质'));

        validObj.add(strategy.isNotEmpty(this.formObj.companyName, selectNot + '单位名称'));
        validObj.add(strategy.isNotEmpty(this.formObj.durationTime, msgNot + '产品期数'));
        validObj.add(strategy.isNotEmpty(this.formObj.repayDuration, msgNot + '已还期数'));
        validObj.add(strategy.isNotEmpty(this.formObj.repayAmount, msgNot + '月还款金'));
        validObj.add(strategy.isNotEmpty(this.formObj.arrivalAmount, msgNot + '到账金额'));
        return validObj.start()
      },
      addBtnEvent() {
        /*逐项验证所有表单*/
        let resultMsg = this.validAll();
        if (resultMsg) {
          this.$toast({
            message: resultMsg,
            duration: 2000
          });
          return false;
        }
        let loanGuid = guid();
        let addData = {
          GUID: loanGuid,
          APPLYGUID: this.applyGuid === undefined ? this.quickLoan.APPLYGUID : this.applyGuid,
          CREATE_USER_ID: this.userLoginInfo.UserGuid,
          CUSTOMERGUID: getParameter('customerGuid'),
          CREDITCARDQUOTA: this.formObj.creditAmount,
          CREDITCARDUSEDMOUNT: this.formObj.usedAmount,
          CREDITCARDUSERATE: this.formObj.usePercent.replace('%', ''),
          ISHAVEOVERDUEOFCREDITCARD: '' + this.formObj.isDelay,
          CREDITCARDOVERDUETIMES: this.formObj.fiveyearsDelay,
          CREDITLOANAMOUNT: this.formObj.loanAmount,
          CREDITLOANBANLANCE: this.formObj.leaveAmount,
          CREDITLOANTIMES: this.formObj.loanTimes,
          QUERYTIMESOFMONTH: this.formObj.oneQueryTimes,
          QUERYTIMESOFTHREEMONTH: this.formObj.threeQueryTimes,
          QUERYTIMESOFHALFYEAR: this.formObj.sixQueryTimes,
          WORKNATURE: '' + this.formObj.workProperty,
          LOAN_TYPE: '{779E6601-CBBE-4205-8774-1D41CE4BAE43}' //恒速贷
        };
        // window.localStorage.setItem('applyLoan', JSON.stringify(sendData));
        let strUrl = '/Apply/InsertAppEliteCreditApply';
        let peerUrl = '/Apply/InsertCounterpartInfor';
        if (this.quickLoan.GUID) {
          strUrl = '/Apply/UpdateEliteCreditApply';
          addData.GUID = this.quickLoan.GUID;
        }
        this.$axios({
          method: 'post',
          url: strUrl,
          data: addData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            let applyGuid = addData.APPLYGUID;
            //添加同行信息
            let peerData = {
              GUID: guid(),
              CREATE_USER_ID: this.userLoginInfo.UserGuid,
              ARRIVAL_AMOUNT: this.formObj.arrivalAmount,
              COUN_NAME_GUID: '' + this.formObj.companyName,
              ELITECREDIT_GUID: addData.GUID,
              PRO_ISSUE: this.formObj.durationTime,
              PRO_NAME: this.formObj.productName,
              REPAID_PERIOD: this.formObj.repayDuration,
              PER_AMOUNT: this.formObj.repayAmount,
              CONTRACT_AMOUNT: this.formObj.finalResult,
              ProductRate: this.formObj.rate
            };
            if (this.partnerInfo.GUID) {
              peerUrl = '/Apply/UpdateCounterpartInfor';
              peerData.GUID = this.partnerInfo.GUID;
            }
            this.$axios({
              method: 'post',
              url: peerUrl,
              data: peerData,
              typeName: '85'
            }).then((success) => {
              if (success && success.data.ResultType === 0) {
                // 恒e家导入基本信息保存
                if (this.dateInfoSource) {
                  window.platformAdapter.setEFromFamily({
                    hsloan: true
                  });
                }

                this.toSuccessLink({
                  data: {
                    realName: this.realName,
                    cardNo: this.cardNo,
                    userGuid: this.customerUserGuid,
                    ApplyGuid: applyGuid
                  },
                  url: 'save-success.html'
                });
              }
            });
          }
        });
      },
      setHeader() {
        window.platformAdapter.quickLoanBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '恒速贷',
          isBack: true,
          rightTitle: '保存',
          rightText: '保存',
          rightCallback: 'quickLoanBtnEvent',
          leftCallback: 'isSaveThisFormBtnEvent'
        })
      }
    },
    mounted() {
      this.setHeader();
      // 调用app 返回的方法
      window.platformAdapter.isSaveThisFormBtnEvent = () => {
        this.showSave()
      }
    },
    created() {
      // this.setLoginInfo();/**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getCompanyName();
      this.getQuickLoan();
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

  .common-part-list {
  }

  .income-part__input-name {
  }

  .box {
    ul {
      width: 690px;
      margin: 0 auto;

      li {
        height: 88px;
        line-height: 88px;
        .w100;
        .fl;

        &.comli {
          .placeholder(#999999, 28px);
        }
      }
    }
  }

  .confirm-layout {
    .weui-dialog__btn_primary {
      color: #44A4EF;
    }
  }

  .shell {
    width: 100%;
    line-height: 200%;
    text-align: center;
    background: rgba(239, 239, 244, 1);
    font-size: 3.733vw;
  }
</style>
