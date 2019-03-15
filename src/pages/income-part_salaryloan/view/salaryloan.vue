<template>
  <div class="income-part">
    <!--<div class="income-part-title">-->

    <!--</div>-->
    <transition>
      <credit-all :creditFormObj="formObj"></credit-all>
    </transition>

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
  import {Confirm, Group, PopupPicker, TransferDomDirective as TransferDom} from 'vux';
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
          loanTimes: '',
          loanAmount: '',
          leaveAmount: '',
          oneQueryTimes: '',
          threeQueryTimes: '',
          sixQueryTimes: ''
        },
        userLoginInfo: {},
        applyGuid: '',
        salaryLoan: {},
        customerUserGuid: getParameter('userGuid'),
        realName: getParameter('realName'),
        cardNo: getParameter('cardNo'),
        dateInfoSource: getParameter('dateInfoSource'), // 是否是恒e家的数据1为是，否则否
        slotProps: {
          tempest: 10
        }
      }
    },
    computed: {},
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
      getSalaryLoan() {
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
            if (success.data.Model != null) {
              let salary = success.data.Model;
              this.salaryLoan = salary;
              this.formObj.creditAmount = salary.CREDITCARDQUOTA;
              this.formObj.usedAmount = salary.CREDITCARDUSEDMOUNT;
              this.formObj.usePercent = salary.CREDITCARDUSERATE + '%';
              this.formObj.isDelay.push(salary.ISHAVEOVERDUEOFCREDITCARD + '');
              this.formObj.fiveyearsDelay = salary.CREDITCARDOVERDUETIMES;
              this.formObj.loanAmount = salary.CREDITLOANAMOUNT;
              this.formObj.leaveAmount = salary.CREDITLOANBANLANCE;
              this.formObj.loanTimes = salary.CREDITLOANTIMES;
              this.formObj.oneQueryTimes = salary.QUERYTIMESOFMONTH;
              this.formObj.threeQueryTimes = salary.QUERYTIMESOFTHREEMONTH;
              this.formObj.sixQueryTimes = salary.QUERYTIMESOFHALFYEAR;
            }
          }
        });
      },
      validAll() {
        let msgNot = '请填写';
        let selectNot = '请选择';
        let formatError = '格式有误，请填写数字';
        let validObj = new Valitor();
        validObj.add(strategy.isNotEmpty(this.formObj.creditAmount, msgNot + '信用卡总额度'));
        if (this.formObj.tbShopingAount)
          validObj.add(strategy.numberFormat(this.formObj.creditAmount, '信用卡总额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.usedAmount, msgNot + '已用额度'));
        if (this.formObj.tbShopingAount)
          validObj.add(strategy.numberFormat(this.formObj.usedAmount, '已用额度' + formatError));
        validObj.add(strategy.isNotEmpty(this.formObj.usePercent, msgNot + '使用率'));
        validObj.add(strategy.isNotEmpty(this.formObj.fiveyearsDelay, msgNot + '近五年逾期次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.isDelay, selectNot + '当前是否逾期'));
        validObj.add(strategy.isNotEmpty(this.formObj.loanTimes, msgNot + '信用贷款笔数'));
        validObj.add(strategy.isNotEmpty(this.formObj.loanAmount, selectNot + '总金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.leaveAmount, msgNot + '剩余金额'));
        validObj.add(strategy.isNotEmpty(this.formObj.oneQueryTimes, msgNot + '近一个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.threeQueryTimes, msgNot + '近三个月查询次数'));
        validObj.add(strategy.isNotEmpty(this.formObj.sixQueryTimes, msgNot + '近半年查询次数'));
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
        let addData = {
          GUID: guid(),
          APPLYGUID: this.applyGuid === undefined ? this.salaryLoan.APPLYGUID : this.applyGuid,
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
          LOAN_TYPE: '{F95985AC-A892-47F1-B043-2D9FA5095E1C}' //瑞薪贷
        };
        // window.localStorage.setItem('applyLoan', JSON.stringify(sendData));
        let strUrl = '/Apply/InsertAppEliteCreditApply';
        if (this.salaryLoan.GUID) {
          strUrl = '/Apply/UpdateEliteCreditApply';
          addData.GUID = this.salaryLoan.GUID;
        }
        this.$axios({
          method: 'post',
          url: strUrl,
          data: addData,
          typeName: '85'
        }).then((success) => {
          if (success && success.data.ResultType === 0) {
            // 恒e家导入基本信息保存
            if (this.dateInfoSource) {
              window.platformAdapter.setEFromFamily({
                rxloan: true
              });
            }

            this.toSuccessLink({
              data: {
                realName: this.realName,
                cardNo: this.cardNo,
                userGuid: this.customerUserGuid,
                ApplyGuid: addData.APPLYGUID
              },
              url: 'save-success.html'
            });
          }
        });
      },
      setHeader() {
        window.platformAdapter.salaryLoanBtnEvent = () => {
          this.addBtnEvent();
        };
        Native.NUI.setHeader({
          title: '瑞薪贷',
          isBack: true,
          rightTitle: '保存',
          rightText: '保存',
          rightCallback: 'salaryLoanBtnEvent',
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
      //this.setLoginInfo();/**测试用，正式环境删除 */
      this.getLoginInfo();
      this.getSalaryLoan();
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
